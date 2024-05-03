import * as drizzle_orm from 'drizzle-orm';
import * as drizzle_orm_mysql_core from 'drizzle-orm/mysql-core';
import { MySqlColumn } from 'drizzle-orm/mysql-core';
export { groupTagCols, groupTagTableFactory, tagCols, tagTableFactory } from '@affinity-lab/storm/dist/plugins/tag/helper/schema';
export { stormStorageSchemaFactory } from '@affinity-lab/storm/dist/plugins/storage/helper/storm-storage-schema-factory';

/**
 * Generates a definition for an auto-incrementing primary key column named 'id' in a MySQL database.
 * @returns A MySQL integer builder object with additional constraints for the 'id' column.
 */
declare function id(): drizzle_orm.NotNull<drizzle_orm.HasDefault<drizzle_orm_mysql_core.MySqlIntBuilderInitial<"id">>>;
/**
 * Creates a reference column definition.
 * @param name - The name of the column.
 * @param field - A function that returns the reference field.
 * @param [nullable=false] - Indicates whether the column is nullable (default: false).
 * @returns  A reference column definition.
 */
declare function reference(name: string, field: () => MySqlColumn, nullable?: boolean): drizzle_orm_mysql_core.MySqlIntBuilderInitial<string>;

export { id, reference };
