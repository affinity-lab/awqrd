import {Dto, EntityRepositoryInterface, prevDto, stmt} from "@affinity-lab/storm";
import {MaterializeIt, type State, T_Class} from "@affinity-lab/util";
import {and, eq, not, sql} from "drizzle-orm";
import {type MySqlTable} from "drizzle-orm/mysql-core";
import {type MySql2Database} from "drizzle-orm/mysql2";
import {tagError} from "./helper/error";
import {TagEntity, TagRepository} from "./tag-repository";

export type GroupUsage = {
	repo: EntityRepositoryInterface,
	field: string,
	groupField: string,
	mode?: "JSON" | "LIST"
}

export class GroupTagEntity extends TagEntity {
	declare groupId: number | string
}


// TODO test this
export class GroupTagRepository<
	SCHEMA extends MySqlTable,
	ITEM extends GroupTagEntity,
	DTO extends Dto<SCHEMA> & { name: string } = Dto<SCHEMA> & { name: string },
	ENTITY extends T_Class<ITEM, typeof GroupTagEntity> = T_Class<ITEM, typeof GroupTagEntity>,
> extends TagRepository<SCHEMA, ITEM> {

	protected usages: Array<GroupUsage> = []

	constructor(readonly db: MySql2Database<any>, readonly schema: SCHEMA, readonly entity: ENTITY) {super(db, schema, entity)}

	@MaterializeIt
	protected get stmt_groupGetByName() {
		return stmt<{ names: Array<string>, groupId: number | string }, Array<ITEM>>(
			this.db.select().from(this.schema).where(sql`name IN (${sql.placeholder("names")}) AND groupId = ${sql.placeholder("groupId")}`), this.instantiate.all
		)
	}

	@MaterializeIt
	protected get stmt_getByGroup() {
		return stmt<{groupId: number | string }, Array<ITEM>>(
			this.db.select().from(this.schema).where(sql`groupId = ${sql.placeholder("groupId")}`), this.instantiate.all
		)
	}

	async getToGroup(groupId: number) {
		return this.stmt_getByGroup({groupId});
	}

	// protected stmt_groupGetByName = stmt<{ names: Array<string>, groupId: number | string }, Array<ITEM>>(this.db.select().from(this.schema).where(sql`name IN (${sql.placeholder("names")}) AND groupId = ${sql.placeholder("groupId")}`), this.instantiate.all)

	/**
	 * Get tags by name and groupId
	 * @param names
	 * @param groupId
	 */
	public async getByName(names: Array<string>, groupId?: number | string): Promise<Array<ITEM>>;
	public async getByName(name: string, groupId?: number | string): Promise<ITEM | undefined>;
	public async getByName(names: Array<string> | string, groupId?: number | string): Promise<ITEM | undefined | Array<ITEM>> {
		if (!groupId) throw tagError.groupId();
		let isArray = Array.isArray(names);
		if (typeof names === "string") names = [names];
		if (names.length === 0) return isArray ? [] : undefined;
		let tags = await this.stmt_groupGetByName({names, groupId: groupId!});
		return !isArray ? tags[0] : tags;
	}

	/**
	 * Delete a tag from all usages
	 * @param name
	 * @param groupId
	 */
	public async deleteInUsages(name: string, groupId?: number | string): Promise<void> {
		if (!groupId) throw tagError.groupId();
		name = `${name}`
		for (let usage of this.usages) {
			let set: Record<string, any> = {}
			set[usage.field] = sql`trim(both ',' from replace(concat(',', ${usage.repo.schema[usage.field]} , ','), ',${name},', ','))`;
			usage.repo.db.update(usage.repo.schema).set(set).where(and(sql`FIND_IN_SET("${name}", ${usage.repo.schema[usage.field]})`, eq(usage.repo.schema[usage.groupField], groupId)));
		}
	}

	/**
	 * Rename a tag
	 * @param oldName
	 * @param newName
	 * @param groupId
	 */
	public async rename(oldName: string, newName: string, groupId?: number | string): Promise<void> {
		oldName = oldName.replace(',', "").trim();
		newName = newName.replace(',', "").trim();
		if (oldName === newName) return
		let o = await this.getByName(oldName, groupId);
		if (!o) return
		let n = await this.getByName(newName, groupId);
		let item = Array.isArray(o) ? o[0] : o;
		if (!n) {
			item.name = newName
			await this.update(item)
		} else await this.delete(item);
		await this.doRename(oldName, newName, groupId);
	}

	// ------------------------------------------ PIPELINE HELPERS


	public async updateTag(repository: EntityRepositoryInterface, dto: Record<string, any>, prevDto: Record<string, any>, fieldName?: string) {
		if (!fieldName) throw tagError.selfRename();
		let groupId = dto[fieldName];
		let {prev, curr} = this.changes(repository, dto, prevDto);
		await this.addTag(curr.filter(x => !prev.includes(x)), groupId);
		await this.deleteTag(prev.filter(x => !curr.includes(x)), groupId);
	}


	public async selfRename(dto: Record<string, any>, prevDto: Record<string, any>, fieldName?: string) {
		if (!fieldName) throw tagError.selfRename();
		let groupId: number | string | undefined | null = dto[fieldName];
		if (!groupId) throw tagError.groupId();
		if (dto.name && dto.name !== prevDto.name) await this.doRename(prevDto.name, dto.name, groupId);
	}

	// ------------------------------------------ INTERNAL HELPERS


	protected async addTag(names: Array<string>, groupId?: number | string): Promise<void> {
		let items = await this.getByName(names, groupId).then(r => (r).map(i => i.name))
		let toAdd = names.filter(x => !items.includes(x));
		for (let tag of toAdd) {
			let item = await this.create()
			item.name = tag as InstanceType<ENTITY>["name"]
			await this.insert(item);
		}
	}

	protected async deleteTag(names: Array<string>, groupId?: number | string): Promise<void> {
		let items = await this.getByName(names, groupId)
		if (items.length === 0) return;
		await this.deleteItems(items, groupId);
	}

	protected async deleteItems(items: Array<ITEM>, groupId?: number | string) {
		if (!groupId) throw tagError.groupId();
		for (let item of items) {
			let doDelete = true;
			for (let usage of this.usages) {
				let res = await usage.repo.db.select().from(usage.repo.schema).where(and(sql`FIND_IN_SET(${item.name}, ${usage.repo.schema[usage.field]})`, eq(usage.repo.schema[usage.groupField], groupId))).limit(1).execute();
				if (res.length !== 0) {
					doDelete = false;
					break;
				}
			}
			if (doDelete) {
				await this.delete(item);
				await this.deleteInUsages(item.name as string, groupId);
			}
		}
	}


	protected async doRename(oldName: string, newName: string, groupId?: number | string) {
		if (!groupId) throw tagError.groupId();
		let nN = `$.${newName}`;
		let oN = `$.${oldName}`;
		let eN = `"${newName}"`;
		let eO = `"${oldName}"`;
		let oldN = `,${oldName},`
		let newN = `,${newName},`
		for (let usage of this.usages) {
			let set: Record<string, any> = {};
			if (usage.mode && usage.mode === "JSON") {
				let w = and(sql`json_extract(${usage.repo.schema[usage.field]}, ${oN}) > 0`, sql`json_extract(${usage.repo.schema[usage.field]}, ${nN}) is NULL`, eq(usage.repo.schema[usage.groupField], groupId))
				set[usage.field] = sql`replace(${usage.repo.schema[usage.field]}, ${eO}, ${eN})`;
				await usage.repo.db.update(usage.repo.schema).set(set).where(w);
				w = and(sql`json_extract(${usage.repo.schema[usage.field]}, ${oN}) > 0`, sql`json_extract(${usage.repo.schema[usage.field]}, ${nN}) > 0`)
				// set[usage.field] = sql`json_remove(json_replace(${usage.repo.schema[usage.field]}, ${nN}, json_value(${usage.repo.schema[usage.field]}, ${nN}) + json_value(${usage.repo.schema[usage.field]}, ${oN})), ${oN})`;
				set[usage.field] = sql`json_remove(${usage.repo.schema[usage.field]}, ${oN})`; // replace this line with the one above, to add the values together
				await usage.repo.db.update(usage.repo.schema).set(set).where(w);
			} else {
				set[usage.field] = sql`trim(both ',' from replace(concat(',', ${usage.repo.schema[usage.field]} , ','), ${oldN}, ${newN}))`;
				await usage.repo.db.update(usage.repo.schema).set(set).where(and(sql`FIND_IN_SET(${oldName}, ${usage.repo.schema[usage.field]})`, not(sql`FIND_IN_SET(${newName}, ${usage.repo.schema[usage.field]})`), eq(usage.repo.schema[usage.groupField], groupId)));
				set[usage.field] = sql`trim(both ',' from replace(concat(',', ${usage.repo.schema[usage.field]} , ','), ${oldN}, ','))`;
				await usage.repo.db.update(usage.repo.schema).set(set).where(and(sql`FIND_IN_SET(${oldName}, ${usage.repo.schema[usage.field]})`, sql`FIND_IN_SET(${newName}, ${usage.repo.schema[usage.field]})`, eq(usage.repo.schema[usage.groupField], groupId)));
			}
		}
	}


	// ------------------------------------------ PIPELINE PLUGIN

	plugin(field: string, groupField?: string, mode: "JSON" | "LIST" = "LIST") {
		if (!groupField) throw new Error("GROUPID MUST BE DEFINED !!!!!!!");
		return (repository: EntityRepositoryInterface) => {

			let usage: GroupUsage = {repo: repository, field, groupField, mode}
			//TODO: CHECK IF THIS WORKS AND IF YES TRY TO TYPEHINT IT
			this.addUsage(usage)

			repository.pipelines.update.blocks
				.prepare.append(async (state: State) => await prevDto(state, repository))
				.prepare.append(async (state: State) => this.prepare(repository, state.dto))
				.finalize.append(async (state: State) => {
					await this.selfRename(state.dto, state.prevDto, groupField);
					await this.updateTag(repository, state.dto, state.prevDto, groupField);
				}
			)

			repository.pipelines.delete.blocks
				.prepare.append(async (state: State) => await prevDto(state, repository))
				.finalize.append(async (state: State) => {
					await this.deleteTag(state.prevDto[usage.field].split(','), groupField)
				}
			)

			repository.pipelines.insert.blocks
				.prepare.append(async (state: State) => this.prepare(repository, state.dto))

			repository.pipelines.overwrite.blocks
				.prepare.append(async (state: State) => await prevDto(state, repository))
				.finalize.append(async (state: State) => {
					await this.selfRename(state.dto, await prevDto(state, repository), groupField);
					await this.updateTag(repository, state.dto, await prevDto(state, repository), groupField);
				}
			)
		}
	}
}