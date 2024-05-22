import {
	MySqlColumn,
	type MySqlJoin,
	type MySqlSelectWithout,
	type MySqlTableWithColumns
} from "drizzle-orm/mysql-core";
import {type MySql2Database} from "drizzle-orm/mysql2";
import {and, asc, desc, getTableName, like, or, sql, SQL, type SQLWrapper} from "drizzle-orm";
import type {AnyMySqlSelectQueryBuilder} from "drizzle-orm/mysql-core/query-builders/select.types";
import type {GetSelectTableSelection, SelectResultField} from "drizzle-orm/query-builders/select.types";
type MaybeArray<T> = T | Array<T>;
type Order = { by: MySqlColumn, reverse: boolean | undefined };
export type Orders = Record<string, Array<Order>>;
export type Search = MaybeArray<MySqlColumn | JoinedQuickSearch> | undefined;
export type Filter = SQLWrapper | SQL | undefined;
export type BaseSelect<A extends AnyMySqlSelectQueryBuilder = any, B extends boolean = any, C extends keyof A & string = any> = MySqlSelectWithout<A, B, C>;

export class JoinedQuickSearch {
	constructor(readonly table: MySqlTableWithColumns<any>, readonly field: string, readonly connection: SQL) {
	}
}

export class IList<SCHEMA extends MySqlTableWithColumns<any> = any> {
	constructor(
		protected schema: SCHEMA,
		protected db: MySql2Database<any>,
		protected quickSearchFields: Search
	) {
	}

	protected export(item: { [K in keyof { [Key in keyof GetSelectTableSelection<SCHEMA> & string]: SelectResultField<GetSelectTableSelection<SCHEMA>[Key], true> }]: { [Key in keyof GetSelectTableSelection<SCHEMA> & string]: SelectResultField<GetSelectTableSelection<SCHEMA>[Key], true> }[K] }) {
		return item;
	}

	public async page(reqPageIndex: number, pageSize: number, search?: string, order?: string, filter?: Record<string, any>) {
		let w = await this.where(search, filter)
		let select = this.select(w);
		select = this.orderBy(select, order);
		let c = await this.count(w);
		let pageIndex = this.calcPageIndex(reqPageIndex, pageSize, c);
		if (pageSize) select = this.pagination(select, pageIndex, pageSize);
		const res = await select.execute();
		let items = [];
		let type = getTableName(this.schema);
		for (let item of res) items.push({data: await this.export(item), type});
		return {items, page: pageIndex, count: c}
	}

	private select(where: SQL | undefined, count: boolean = false): MySqlSelectWithout<any, any, any> {
		let s = count ? this.db.select({amount: sql<number>`count('*')`}) : this.db.select();
		let from = s.from(this.schema);
		let joinedS: MySqlJoin<any, any, any, any>;
		for (let j of this.join()) joinedS = (joinedS || from).innerJoin(j.table, j.connection);
		return (joinedS || from).where(where);
	}

	private join() {
		let r: Array<{ table: MySqlTableWithColumns<any>, connection: SQL }> = [];
		if (this.quickSearchFields) (Array.isArray(this.quickSearchFields) ? this.quickSearchFields : [this.quickSearchFields])
			.forEach((i: MySqlColumn | JoinedQuickSearch) => {
				if (i instanceof JoinedQuickSearch && !r.includes({table: i.table, connection: i.connection})) {
					r.push({table: i.table, connection: i.connection});
				}
			});
		return r;
	}

	private pagination(base: BaseSelect, pageIndex: number, pageSize: number): BaseSelect {
		return base.limit(pageSize).offset(pageIndex * pageSize)
	}

	private async where(search?: string, filter?: Record<string, any>): Promise<SQL | undefined> {
		const f: Array<Filter> = [await this.defaultFilter(filter), await this.composeFilter(filter), await this.quickSearchFilter(search)].filter(filters => !!filters);
		return and(...f);
	}

	protected async defaultFilter(args: Record<string, any> | undefined): Promise<Filter> {
		return undefined;
	}

	protected async composeFilter(args: Record<string, any> | undefined): Promise<Filter> {
		return undefined;
	}

	protected async quickSearchFilter(key?: string): Promise<Filter> {
		if (typeof key === "undefined" || key.trim().length === 0) return or()!;
		let likes: Array<SQL> = [];
		for (let col of Array.isArray(this.quickSearchFields) ? this.quickSearchFields : [this.quickSearchFields]) {
			if (col instanceof MySqlColumn) likes.push(like(col as MySqlColumn, `%${key}%`));
			else likes.push(like(col!.table[col!.field], `%${key}%`));
		}
		return or(...likes)!;
	}

	private calcPageIndex(pageIndex: number, pageSize: number, count: number): number {
		if (pageIndex < 0) return 0;
		if (!pageSize) return 0;
		let max = Math.floor(count / pageSize);
		return pageIndex <= max ? pageIndex : max;
	}

	private async count(where: SQL | undefined): Promise<number> {
		let q = this.select(where, true).prepare()
		return (await q.execute())[0].amount
	}

	protected orderBy(base: BaseSelect, name: string | undefined): BaseSelect {
		// THIS FUNCTION CANNOT BE ASYNC !!!!!!!!!!!!!!!!!!!!
		if (!name) name = Object.keys(this.orders)[0];
		if (Object.keys(this.orders).length === 0 || !Object.keys(this.orders).includes(name)) return base;
		let orderSQLs: Array<SQL> = [];
		for (let o of this.orders[name]) orderSQLs.push(o.reverse ? desc(o.by) : asc(o.by));
		return base.orderBy(...orderSQLs);
	}

	protected get orders(): Orders {
		return {};
	}

}

