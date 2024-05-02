import * as drizzle_orm from 'drizzle-orm';
import * as drizzle_orm_mysql_core from 'drizzle-orm/mysql-core';
import { MySqlColumnBuilder, MySqlColumn } from 'drizzle-orm/mysql-core';
import { MySqlIntBuilderInitial } from 'drizzle-orm/mysql-core/columns/int';

declare const tagCols: (id: () => MySqlIntBuilderInitial<any>) => {
    id: MySqlIntBuilderInitial<any>;
    name: drizzle_orm.NotNull<drizzle_orm_mysql_core.MySqlVarCharBuilderInitial<"name", [string, ...string[]]>>;
};
declare const groupTagCols: (id: () => MySqlIntBuilderInitial<any>, groupCol: MySqlColumnBuilder, fieldName?: string) => Record<string, MySqlColumnBuilder<drizzle_orm.ColumnBuilderBaseConfig<drizzle_orm.ColumnDataType, string> & {
    data: any;
}, object, object, drizzle_orm.ColumnBuilderExtraConfig>>;
declare function tagTableFactory(name: string, id: () => MySqlIntBuilderInitial<any>): drizzle_orm_mysql_core.MySqlTableWithColumns<{
    name: string;
    schema: undefined;
    columns: {
        id: drizzle_orm_mysql_core.MySqlColumn<{
            name: any;
            tableName: string;
            dataType: "number";
            columnType: "MySqlInt";
            data: number;
            driverParam: string | number;
            notNull: false;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, object>;
        name: drizzle_orm_mysql_core.MySqlColumn<{
            name: "name";
            tableName: string;
            dataType: "string";
            columnType: "MySqlVarChar";
            data: string;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, object>;
    };
    dialect: "mysql";
}>;
declare function groupTagTableFactory(name: string, id: () => MySqlIntBuilderInitial<any>, groupCol: MySqlColumnBuilder, fieldName?: string): drizzle_orm_mysql_core.MySqlTableWithColumns<{
    name: string;
    schema: undefined;
    columns: {
        [x: string]: drizzle_orm_mysql_core.MySqlColumn<{
            name: string;
            tableName: string;
            dataType: drizzle_orm.ColumnDataType;
            columnType: string;
            data: any;
            driverParam: unknown;
            notNull: false;
            hasDefault: false;
            enumValues: string[] | undefined;
            baseColumn: never;
        }, object>;
    };
    dialect: "mysql";
}>;

declare function stormStorageSchemaFactory(name?: string): drizzle_orm_mysql_core.MySqlTableWithColumns<{
    name: string;
    schema: undefined;
    columns: {
        id: drizzle_orm_mysql_core.MySqlColumn<{
            name: "id";
            tableName: string;
            dataType: "number";
            columnType: "MySqlSerial";
            data: number;
            driverParam: number;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, object>;
        name: drizzle_orm_mysql_core.MySqlColumn<{
            name: "name";
            tableName: string;
            dataType: "string";
            columnType: "MySqlVarChar";
            data: string;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, object>;
        itemId: drizzle_orm_mysql_core.MySqlColumn<{
            name: "itemId";
            tableName: string;
            dataType: "number";
            columnType: "MySqlInt";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, object>;
        data: drizzle_orm_mysql_core.MySqlColumn<{
            name: "data";
            tableName: string;
            dataType: "json";
            columnType: "MySqlJson";
            data: unknown;
            driverParam: string;
            notNull: false;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, object>;
    };
    dialect: "mysql";
}>;

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

export { groupTagCols, groupTagTableFactory, id, reference, stormStorageSchemaFactory, tagCols, tagTableFactory };
