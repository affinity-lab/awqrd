import { ClassMetaData, type State } from "@affinity-lab/util";
import { MySqlColumn } from "drizzle-orm/mysql-core";
import type { MySqlSelectWithout } from "drizzle-orm/mysql-core/query-builders/select.types";
import { EntityRepositoryInterface } from "./entity/entity-repository-interface";
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
export declare function stmt<RES>(stmt: MySqlSelectWithout<any, any, any>, ...processes: ((res: any) => any)[]): () => Promise<RES>;
export declare function stmt<ARGS, RES>(stmt: MySqlSelectWithout<any, any, any>, ...processes: ((res: any) => any)[]): (args: ARGS) => Promise<RES>;
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
/**
 * Retrieves a single item from a repository by a specified field.
 * @param repo
 * @param fieldName
 * @returns A function that retrieves the previous DTO of an item.
 */
export declare function getByFactory<T extends string | number, R>(repo: EntityRepositoryInterface, fieldName: string): (search: T) => Promise<R | undefined>;
export declare function getAllByFactory<T extends string | number, R>(repo: EntityRepositoryInterface, fieldName: string): (search: T) => Promise<Array<R>>;
/**
 * Retrieves the previous data transfer object (DTO) of an item.
 * Use it in pipeline functions to access the previous DTO of the item.
 * @param state
 * @param repository
 */
export declare function prevDto(state: State, repository: EntityRepositoryInterface): Promise<any>;
/**
 * Export decorator. Marks an entity property as exportable.
 */
export declare function Export(target: any, name: PropertyKey): void;
export declare namespace Export {
    var metadata: ClassMetaData;
}
/**
 * Import decorator. Marks an entity property as importable.
 */
export declare function Import(target: any, name: PropertyKey): void;
export declare namespace Import {
    var metadata: ClassMetaData;
}
export declare let stormSchemaHelpers: {
    id: () => import("drizzle-orm").NotNull<import("drizzle-orm").HasDefault<import("drizzle-orm/mysql-core").MySqlIntBuilderInitial<"id">>>;
    reference: (name: string, field: () => MySqlColumn, nullable?: boolean) => import("drizzle-orm/mysql-core").MySqlIntBuilderInitial<string>;
};
