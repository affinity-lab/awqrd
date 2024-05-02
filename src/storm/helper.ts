import {eq, sql} from "drizzle-orm";
import {MySqlColumn} from "drizzle-orm/mysql-core";
import type {MySqlSelectWithout} from "drizzle-orm/mysql-core/query-builders/select.types";
import {EntityRepository} from "./entity-repository.ts";

/**
 * Creates an SQL expression for checking if a column's value is in a list of IDs.
 * @param col - The column to check.
 * @param ids - The list of IDs.
 * @returns An SQL expression.
 */
export function In(col: MySqlColumn, ids: string) { return sql`${col} in (${sql.placeholder(ids)})`;}

/**
 * Executes a MySQL SELECT statement asynchronously, applying multiple processing functions to the result.
 * @template ARGS - Type of the arguments accepted by the MySQL SELECT statement.
 * @template RES - Type of the result returned by the processing functions.
 * @param stmt - The MySQL SELECT statement object.
 * @param processes - Processing functions to be applied to the result sequentially.
 * @returns A promise that resolves with a function accepting arguments of type ARGS and returning a result of type RES.
 */
export function stmt<ARGS = Record<string, any>, RES = any>(stmt: MySqlSelectWithout<any, any, any>, ...processes: ((res: any) => any)[]
) {
	let prepared = stmt.prepare();

	return async (args: ARGS) => {
		let result = await prepared.execute(args);
		for (const process of processes) result = await process(result);
		return result as RES;
	};
}
/**
 * Set of utility functions to generate SQL LIKE query patterns for string matching.
 */
export const likeString = {
	/**
	 * Generates a SQL LIKE query pattern to match strings that start with the specified search string.
	 * @param search - The string to match within.
	 * @returns A SQL LIKE query pattern.
	 */
	startsWith: (search: string) => search + "%",
	/**
	 * Generates a SQL LIKE query pattern to match strings that end with the specified search string.
	 * @param search - The string to match within.
	 * @returns A SQL LIKE query pattern.
	 */
	endWith: (search: string) => "%" + search,
	/**
	 * Generates a SQL LIKE query pattern to match strings that contain the specified search string.
	 * @param search - The string to match within.
	 * @returns A SQL LIKE query pattern.
	 */
	contains: (search: string) => "%" + search + "%",
};

export function getByFactory
<T extends string | number, R>
(repo: EntityRepository<any, any, any>, fieldName: string):
	(search: T) => Promise<R | undefined>
{
	let field = repo.schema[fieldName];
	let stmt = repo.db.select().from(repo.schema).where(eq(field, sql.placeholder("search"))).prepare();
	let fn = async (search: T) => {
		let data = await stmt.execute({search})
		if (data.length === 0) return undefined;
		else return await repo.instantiators.first(data) as R;
	};
	(fn as unknown as {stmt:any}).stmt = stmt;
	return fn;
}