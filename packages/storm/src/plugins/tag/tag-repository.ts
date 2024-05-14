import type {T_Class} from "@affinity-lab/storm/src/types";
import type {MaybeArray} from "@affinity-lab/util";
import {type State} from "@affinity-lab/util";
import {and, not, sql} from "drizzle-orm";
import {MySqlTable} from "drizzle-orm/mysql-core";
import {Entity} from "../../entity";
import {EntityRepository} from "../../entity-repository";
import {Export} from "../../export";
import {stmt} from "../../helper";
import type {Dto} from "../../types";
import {tagError} from "./helper/error";

export type Usage = { "repo": EntityRepository<any, any, any>, "field": string } & Record<string, any>

export class TagEntity extends Entity {
	@Export declare name: string
}


export class TagRepository<
	SCHEMA extends MySqlTable,
	ITEM extends TagEntity,
	DTO extends Dto<SCHEMA> & { name: string } = Dto<SCHEMA> & { name: string },
	ENTITY extends T_Class<ITEM, typeof Entity> = T_Class<ITEM, typeof Entity>,
> extends EntityRepository<SCHEMA, ITEM> {

	protected usages: Array<Usage> = []

	public addUsage(usage: MaybeArray<Usage>) {
		this.usages.push(...(Array.isArray(usage) ? usage : [usage]));
	}

	protected stmt_getByName = stmt<{ names: Array<string> }, Array<ITEM>>(
		this.db.select().from(this.schema).where(sql`name IN (${sql.placeholder("names")})`),
		this.instantiators.all
	)

	async getByName(names: Array<string>): Promise<Array<ITEM>>
	async getByName(name: string): Promise<ITEM | undefined>
	async getByName(names: Array<string> | string): Promise<ITEM | undefined | Array<ITEM>> {
		let isArray = Array.isArray(names);
		if (typeof names === "string") names = [names];
		if (names.length === 0) return isArray ? [] : undefined;
		let tags = await this.stmt_getByName({names});
		return !isArray ? tags[0] : tags;
	}

	public prepare(repository: EntityRepository<any, any, any>, state: State) {
		let values = state.dto;
		for (let usage of this.usages) {
			if (usage.repo === repository) {
				if (!values[usage.field]) values[usage.field] = "";
				values[usage.field] = [...new Set((values[usage.field] as string).trim().split(',').map(x => x.trim()).filter(x => !!x))].join(',');
			}
		}
	}

	protected changes(repository: EntityRepository<any, any>, state: State): { prev: Array<string>, curr: Array<string> } {
		let values = state.dto;
		let originalItem = state.prevDto;

		if (!originalItem) throw tagError.itemNotFound(repository.constructor.name);
		let prev: Array<string> = [];
		let curr: Array<string> = []
		for (let usage of this.usages) {
			if (usage.repo === repository) {
				prev.push(...(originalItem[usage.field] ? originalItem[usage.field].split(',') : []));
				curr.push(...(values[usage.field] ? (values[usage.field] as string).split(',') : []));
			}
		}
		prev = [...new Set(prev)];
		curr = [...new Set(curr)];
		return {prev, curr};
	}

	async updateTag(repository: EntityRepository<any, any>, state: State) {
		let {prev, curr} = this.changes(repository, state);
		await this.addTag(curr.filter(x => !prev.includes(x)));
		await this.deleteTag(prev.filter(x => !curr.includes(x)));
	}


	protected async addTag(names: Array<string>): Promise<void> {
		let items: string[] = await this.getByName(names).then(r => r.map(i => i.name))
		let toAdd: string[] = names.filter(x => !items.includes(x));
		for (let tag of toAdd) {
			let item = await this.create()
			item.name = tag;
			await this.insert(item);
		}
	}

	// DELETE ----------------------------------------

	protected async deleteTag(names: Array<string>): Promise<void> {
		let items = await this.getByName(names)
		if (items.length === 0) return;
		await this.deleteItems(items);
	}

	protected async deleteItems(items: Array<ITEM>) {
		for (let item of items) {
			let doDelete = true;
			for (let usage of this.usages) {
				let res = await usage.repo.db.select().from(usage.repo.schema).where(sql`FIND_IN_SET(${item.name}, ${usage.repo.schema[usage.field]})`).limit(1).execute();
				if (res.length !== 0) {
					doDelete = false;
					break;
				}
			}
			if (doDelete) {
				await this.delete(item);
			}
		}
	}

	async deleteInUsages(name: string): Promise<void> {
		name = `${name}`
		for (let usage of this.usages) {
			let set: Record<string, any> = {}
			set[usage.field] = sql`trim(both ',' from replace(concat(',', ${usage.repo.schema[usage.field]} , ','), ',${name},', ','))`;
			usage.repo.db.update(usage.repo.schema).set(set).where(sql`FIND_IN_SET("${name}", ${usage.repo.schema[usage.field]})`);
		}
	}

	// ------------------------------------------

	protected doRename(oldName: string, newName: string) {
		for (let usage of this.usages) {
			let set: Record<string, any> = {};
			set[usage.field] = sql`trim(both ',' from replace(concat(',', ${usage.field} , ','), ',${oldName},', ',${newName},'))`;
			usage.repo.db.update(usage.repo.schema).set(set).where(and(sql`FIND_IN_SET("${oldName}", ${usage.field})`, not(sql`FIND_IN_SET("${newName}", ${usage.field})`)));
			set[usage.field] = sql`trim(both ',' from replace(concat(',', ${usage.field} , ','), ',${oldName},', ','))`;
			usage.repo.db.update(usage.repo.schema).set(set).where(and(sql`FIND_IN_SET("${oldName}", ${usage.field})`, sql`FIND_IN_SET("${newName}", ${usage.field})`));
		}
	}

	async selfRename(state: State) {
		let values = state.dto;
		let originalItem = state.prevDto;
		if (values.name && values.name !== originalItem.name) {
			await this.doRename(originalItem.name, values.name);
		}
	}

	async rename(oldName: string, newName: string): Promise<void> {
		oldName = oldName.replace(',', "").trim();
		newName = newName.replace(',', "").trim();
		if (oldName === newName) return
		let o = await this.getByName(oldName);
		if (!o) return
		let n = await this.getByName(newName);

		if (!n) {
			o.name = newName
			await this.update(o)
		} else {
			await this.delete(o);
		}

		await this.doRename(oldName, newName);
	}


}
