import {TagEntity, TagRepository} from "@affinity-lab/awqrd-storm/plugins/tag/tag-repository";
import {type MySql2Database} from "drizzle-orm/mysql2";
import {type MySqlTable} from "drizzle-orm/mysql-core";
import {and, not, sql} from "drizzle-orm";
import {MaterializeIt} from "@affinity-lab/awqrd-util/materialize-it";
import {stmt} from "@affinity-lab/awqrd-storm/helper";
import type {Dto, EntityInitiator} from "@affinity-lab/awqrd-storm/types";
import {tagError} from "@affinity-lab/awqrd-storm/plugins/tag/helper/error";
import {Export} from "@affinity-lab/awqrd-storm/export";

export class GroupTagEntity extends TagEntity {
	@Export groupId: number | string | null = null
}

export class GroupTagRepository<DB extends MySql2Database<any>, SCHEMA extends MySqlTable, ENTITY extends EntityInitiator<ENTITY, typeof GroupTagEntity>> extends TagRepository<DB, SCHEMA, ENTITY> {

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
		let isArray = Array.isArray(names);
		if(typeof names === "string") names = [names];
		if(names.length === 0) return isArray ? [] : undefined;
		if(!groupId) throw tagError.groupId();
		let tags = await this.stmt_groupGetByName({names, groupId: groupId!});
		return !isArray ? tags[0] : tags;
	}

	protected async doRename(oldName: string, newName: string) {
		let nN = `$.${newName}`;
		let oN = `$.${oldName}`;
		let eN = `"${newName}"`;
		let eO = `"${oldName}"`;
		let oldN = `,${oldName},`
		let newN = `,${newName},`
		for (let usage of this.usages) {
			let set: Record<string, any> = {};
			if(usage.mode && usage.mode === "JSON") {
				let w = and(sql`json_extract(${usage.repo.schema[usage.field]}, ${oN}) > 0`, sql`json_extract(${usage.repo.schema[usage.field]}, ${nN}) is NULL`)
				set[usage.field] = sql`replace(${usage.repo.schema[usage.field]}, ${eO}, ${eN})`;
				await usage.repo.db.update(usage.repo.schema).set(set).where(w);
				w = and(sql`json_extract(${usage.repo.schema[usage.field]}, ${oN}) > 0`, sql`json_extract(${usage.repo.schema[usage.field]}, ${nN}) > 0`)
				// set[usage.field] = sql`json_remove(json_replace(${usage.repo.schema[usage.field]}, ${nN}, json_value(${usage.repo.schema[usage.field]}, ${nN}) + json_value(${usage.repo.schema[usage.field]}, ${oN})), ${oN})`;
				set[usage.field] = sql`json_remove(${usage.repo.schema[usage.field]}, ${oN})`; // replace this line with the one above, to add the values together
				await usage.repo.db.update(usage.repo.schema).set(set).where(w);
			} else {
				set[usage.field] = sql`trim(both ',' from replace(concat(',', ${usage.repo.schema[usage.field]} , ','), ${oldN}, ${newN}))`;
				await usage.repo.db.update(usage.repo.schema).set(set).where(and(sql`FIND_IN_SET(${oldName}, ${usage.repo.schema[usage.field]})`, not(sql`FIND_IN_SET(${newName}, ${usage.repo.schema[usage.field]})`)));
				set[usage.field] = sql`trim(both ',' from replace(concat(',', ${usage.repo.schema[usage.field]} , ','), ${oldN}, ','))`;
				await usage.repo.db.update(usage.repo.schema).set(set).where(and(sql`FIND_IN_SET(${oldName}, ${usage.repo.schema[usage.field]})`, sql`FIND_IN_SET(${newName}, ${usage.repo.schema[usage.field]})`));
			}
		}
	}
}