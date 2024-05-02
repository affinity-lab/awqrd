import { MySqlColumn } from "drizzle-orm/mysql-core";
import { tagCols, tagTableFactory, groupTagTableFactory, groupTagCols } from "@affinity-lab/awqrd-storm";
import { stormStorageSchemaFactory } from "@affinity-lab/awqrd-storm";
/**
 * Generates a definition for an auto-incrementing primary key column named 'id' in a MySQL database.
 * @returns A MySQL integer builder object with additional constraints for the 'id' column.
 */
export declare function id(): import("drizzle-orm").NotNull<import("drizzle-orm").HasDefault<import("drizzle-orm/mysql-core").MySqlIntBuilderInitial<"id">>>;
/**
 * Creates a reference column definition.
 * @param name - The name of the column.
 * @param field - A function that returns the reference field.
 * @param [nullable=false] - Indicates whether the column is nullable (default: false).
 * @returns  A reference column definition.
 */
export declare function reference(name: string, field: () => MySqlColumn, nullable?: boolean): import("drizzle-orm/mysql-core").MySqlIntBuilderInitial<string>;
export { tagCols, tagTableFactory, groupTagCols, groupTagTableFactory, stormStorageSchemaFactory };
