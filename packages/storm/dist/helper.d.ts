import { MySqlColumn } from "drizzle-orm/mysql-core";
import type { MySqlSelectWithout } from "drizzle-orm/mysql-core/query-builders/select.types";
import { EntityRepository } from "./entity-repository";
/**
 * Creates an SQL expression for checking if a column's value is in a list of IDs.
 * @param col - The column to check.
 * @param ids - The list of IDs.
 * @returns An SQL expression.
 */
export declare function In(col: MySqlColumn, ids: string): import("drizzle-orm").SQL<unknown>;
/**
 * Executes a MySQL SELECT statement asynchronously, applying multiple processing functions to the result.
 * @template ARGS - Type of the arguments accepted by the MySQL SELECT statement.
 * @template RES - Type of the result returned by the processing functions.
 * @param stmt - The MySQL SELECT statement object.
 * @param processes - Processing functions to be applied to the result sequentially.
 * @returns A promise that resolves with a function accepting arguments of type ARGS and returning a result of type RES.
 */
export declare function stmt<ARGS = Record<string, any>, RES = any>(stmt: MySqlSelectWithout<any, any, any>, ...processes: ((res: any) => any)[]): (args: ARGS) => Promise<RES>;
/**
 * Set of utility functions to generate SQL LIKE query patterns for string matching.
 */
export declare const likeString: {
    /**
     * Generates a SQL LIKE query pattern to match strings that start with the specified search string.
     * @param search - The string to match within.
     * @returns A SQL LIKE query pattern.
     */
    startsWith: (search: string) => string;
    /**
     * Generates a SQL LIKE query pattern to match strings that end with the specified search string.
     * @param search - The string to match within.
     * @returns A SQL LIKE query pattern.
     */
    endWith: (search: string) => string;
    /**
     * Generates a SQL LIKE query pattern to match strings that contain the specified search string.
     * @param search - The string to match within.
     * @returns A SQL LIKE query pattern.
     */
    contains: (search: string) => string;
};
export declare function getByFactory<T extends string | number, R>(repo: EntityRepository<any, any, any>, fieldName: string): (search: T) => Promise<R | undefined>;
