declare module "storm/src/plugins/tag/helper/schema" {
    import { MySqlColumnBuilder } from "drizzle-orm/mysql-core";
    import { type MySqlIntBuilderInitial } from "drizzle-orm/mysql-core/columns/int";
    export const tagCols: (id: () => MySqlIntBuilderInitial<any>) => {
        id: MySqlIntBuilderInitial<any>;
        name: import("drizzle-orm").NotNull<import("drizzle-orm/mysql-core").MySqlVarCharBuilderInitial<"name", [string, ...string[]]>>;
    };
    export const groupTagCols: (id: () => MySqlIntBuilderInitial<any>, groupCol: MySqlColumnBuilder, fieldName?: string) => Record<string, MySqlColumnBuilder<import("drizzle-orm").ColumnBuilderBaseConfig<import("drizzle-orm").ColumnDataType, string> & {
        data: any;
    }, object, object, import("drizzle-orm").ColumnBuilderExtraConfig>>;
    export function tagTableFactory(name: string, id: () => MySqlIntBuilderInitial<any>): import("drizzle-orm/mysql-core").MySqlTableWithColumns<{
        name: string;
        schema: undefined;
        columns: {
            id: import("drizzle-orm/mysql-core").MySqlColumn<{
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
            name: import("drizzle-orm/mysql-core").MySqlColumn<{
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
    export function groupTagTableFactory(name: string, id: () => MySqlIntBuilderInitial<any>, groupCol: MySqlColumnBuilder, fieldName?: string): import("drizzle-orm/mysql-core").MySqlTableWithColumns<{
        name: string;
        schema: undefined;
        columns: {
            [x: string]: import("drizzle-orm/mysql-core").MySqlColumn<{
                name: string;
                tableName: string;
                dataType: import("drizzle-orm").ColumnDataType;
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
}
declare module "storm/src/plugins/storage/helper/storm-storage-schema-factory" {
    export function stormStorageSchemaFactory(name?: string): import("drizzle-orm/mysql-core").MySqlTableWithColumns<{
        name: string;
        schema: undefined;
        columns: {
            id: import("drizzle-orm/mysql-core").MySqlColumn<{
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
            name: import("drizzle-orm/mysql-core").MySqlColumn<{
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
            itemId: import("drizzle-orm/mysql-core").MySqlColumn<{
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
            data: import("drizzle-orm/mysql-core").MySqlColumn<{
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
}
declare module "schema-helper/src/index" {
    import { MySqlColumn } from "drizzle-orm/mysql-core";
    /**
     * Generates a definition for an auto-incrementing primary key column named 'id' in a MySQL database.
     * @returns A MySQL integer builder object with additional constraints for the 'id' column.
     */
    export function id(): import("drizzle-orm").NotNull<import("drizzle-orm").HasDefault<import("drizzle-orm/mysql-core").MySqlIntBuilderInitial<"id">>>;
    /**
     * Creates a reference column definition.
     * @param name - The name of the column.
     * @param field - A function that returns the reference field.
     * @param [nullable=false] - Indicates whether the column is nullable (default: false).
     * @returns  A reference column definition.
     */
    export function reference(name: string, field: () => MySqlColumn, nullable?: boolean): import("drizzle-orm/mysql-core").MySqlIntBuilderInitial<string>;
}
