import {TagEntity, TagRepository} from "@affinity-lab/awqrd-storm/plugins/tag/tag-repository";
import {type MySql2Database} from "drizzle-orm/mysql2";
import {type MySqlTable} from "drizzle-orm/mysql-core";
import {and, eq, not, sql} from "drizzle-orm";
import {MaterializeIt} from "@affinity-lab/awqrd-util/materialize-it";
import {stmt} from "@affinity-lab/awqrd-storm/helper";
import type {Dto, EntityInitiator} from "@affinity-lab/awqrd-storm/types";
import {tagError} from "@affinity-lab/awqrd-storm/plugins/tag/helper/error";
import {Export} from "@affinity-lab/awqrd-storm/export";
import {type State} from "@affinity-lab/awqrd-util/process-pipeline";
import {EntityRepository} from "@affinity-lab/awqrd-storm/entity-repository";

export class GroupTagEntity extends TagEntity {
	@Export groupId: number | string | null = null
}


// TODO test this
export class GroupTagRepository<DB extends MySql2Database<any>, SCHEMA extends MySqlTable, ENTITY extends EntityInitiator<ENTITY, typeof GroupTagEntity>> extends TagRepository<DB, SCHEMA, ENTITY> {

	// the fieldName property must match the GroupTagEntity's (groupId) field name
	// if you make a new Entity don't forget to add provide the field name in the constructor
	constructor(readonly db: DB, readonly schema: SCHEMA, readonly entity: ENTITY, readonly fieldName: string = "groupId") {
		super(db, schema, entity);
	}

	@MaterializeIt
	protected get stmt_groupGetByName() {
		return stmt<{ names: Array<string>, groupId: number | string}, Array<Dto<SCHEMA>>>(
			this.db.select().from(this.schema).where(sql`name IN (${sql.placeholder("names")}) AND ${this.fieldName} = ${sql.placeholder("groupId")}`)
		)
	}

	async getByName(names: Array<string>, groupId?: number | string): Promise<Array<Dto<SCHEMA>>>
	async getByName(names: string, groupId?: number | string): Promise<Dto<SCHEMA> | undefined>
	async getByName(names: Array<string> | string, groupId?: number | string) {
		if(!groupId) throw tagError.groupId();
		let isArray = Array.isArray(names);
		if(typeof names === "string") names = [names];
		if(names.length === 0) return isArray ? [] : undefined;
		let tags = await this.stmt_groupGetByName({names, groupId: groupId!});
		return !isArray ? tags[0] : tags;
	}

	async updateTag(repository: EntityRepository<any, any, any>, state: State, fieldName?: string) {
		if(!fieldName) throw tagError.selfRename();
		let groupId = state.dto[fieldName];
		let {prev, curr} = this.changes(repository, state);
		await this.addTag(curr.filter(x => !prev.includes(x)), groupId);
		await this.deleteTag(prev.filter(x => !curr.includes(x)), groupId);
	}

	protected async doRename(oldName: string, newName: string, groupId?: number | string) {
		if(!groupId) throw tagError.groupId();
		let nN = `$.${newName}`;
		let oN = `$.${oldName}`;
		let eN = `"${newName}"`;
		let eO = `"${oldName}"`;
		let oldN = `,${oldName},`
		let newN = `,${newName},`
		for (let usage of this.usages) {
			let set: Record<string, any> = {};
			if(usage.mode && usage.mode === "JSON") {
				let w = and(sql`json_extract(${usage.repo.schema[usage.field]}, ${oN}) > 0`, sql`json_extract(${usage.repo.schema[usage.field]}, ${nN}) is NULL`, eq(usage.repo.schema[this.fieldName], groupId))
				set[usage.field] = sql`replace(${usage.repo.schema[usage.field]}, ${eO}, ${eN})`;
				await usage.repo.db.update(usage.repo.schema).set(set).where(w);
				w = and(sql`json_extract(${usage.repo.schema[usage.field]}, ${oN}) > 0`, sql`json_extract(${usage.repo.schema[usage.field]}, ${nN}) > 0`)
				// set[usage.field] = sql`json_remove(json_replace(${usage.repo.schema[usage.field]}, ${nN}, json_value(${usage.repo.schema[usage.field]}, ${nN}) + json_value(${usage.repo.schema[usage.field]}, ${oN})), ${oN})`;
				set[usage.field] = sql`json_remove(${usage.repo.schema[usage.field]}, ${oN})`; // replace this line with the one above, to add the values together
				await usage.repo.db.update(usage.repo.schema).set(set).where(w);
			} else {
				set[usage.field] = sql`trim(both ',' from replace(concat(',', ${usage.repo.schema[usage.field]} , ','), ${oldN}, ${newN}))`;
				await usage.repo.db.update(usage.repo.schema).set(set).where(and(sql`FIND_IN_SET(${oldName}, ${usage.repo.schema[usage.field]})`, not(sql`FIND_IN_SET(${newName}, ${usage.repo.schema[usage.field]})`), eq(usage.repo.schema[this.fieldName], groupId)));
				set[usage.field] = sql`trim(both ',' from replace(concat(',', ${usage.repo.schema[usage.field]} , ','), ${oldN}, ','))`;
				await usage.repo.db.update(usage.repo.schema).set(set).where(and(sql`FIND_IN_SET(${oldName}, ${usage.repo.schema[usage.field]})`, sql`FIND_IN_SET(${newName}, ${usage.repo.schema[usage.field]})`, eq(usage.repo.schema[this.fieldName], groupId)));
			}
		}
	}

	async selfRename(state: State, fieldName?: string) {
		if(!fieldName) throw tagError.selfRename();
		let values = state.dto;
		let originalItem = state.prevDto;
		let groupId = values[fieldName];
		if(!groupId) throw tagError.groupId();
		if (values.name && values.name !== originalItem.name) {
			await this.doRename(originalItem.name, values.name, groupId);
		}
	}

	protected async addTag(names: Array<string>, groupId?: number | string): Promise<void> {
		let items = await this.getByName(names, groupId).then(r=>(r).map(i=>i.name))
		let toAdd = names.filter(x => !items.includes(x));
		for (let tag of toAdd) {
			let item = await this.create()
			item.name = tag as InstanceType<ENTITY>["name"]
			await this.insert(item);
		}
	}

	protected async deleteTag(names: Array<string>, groupId?: number | string): Promise<void> {
		let items = await this.getByName(names, groupId)
		if(items.length === 0) return;
		await this.deleteItems(items, groupId);
	}

	protected async deleteItems(items: Array<Dto<SCHEMA>>, groupId?: number | string) {
		if(!groupId) throw tagError.groupId();
		for (let item of items) {
			let doDelete = true;
			for (let usage of this.usages) {
				let res = await usage.repo.db.select().from(usage.repo.schema).where(and(sql`FIND_IN_SET(${item.name}, ${usage.repo.schema[usage.field]})`, eq(usage.repo.schema[this.fieldName], groupId))).limit(1).execute();
				if (res.length !== 0) {
					doDelete = false;
					break;
				}
			}
			if (doDelete) {
				await this.delete(item.id);
				await this.deleteInUsages(item.name as string, groupId);
			}
		}
	}

	async deleteInUsages(name: string, groupId?: number | string): Promise<void> {
		if(!groupId) throw tagError.groupId();
		name = `${name}`
		for (let usage of this.usages) {
			let set: Record<string, any> = {}
			set[usage.field] = sql`trim(both ',' from replace(concat(',', ${usage.repo.schema[usage.field]} , ','), ',${name},', ','))`;
			usage.repo.db.update(usage.repo.schema).set(set).where(and(sql`FIND_IN_SET("${name}", ${usage.repo.schema[usage.field]})`, eq(usage.repo.schema[this.fieldName], groupId)));
		}
	}

	async rename(oldName: string, newName: string, groupId?: number | string): Promise<void> {
		// TODO call from sapphire
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
		}
		else await this.delete(item);
		await this.doRename(oldName, newName, groupId);
	}
}