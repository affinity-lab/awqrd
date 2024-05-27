import { MySqlColumnBuilder } from "drizzle-orm/mysql-core";
import { type MySqlIntBuilderInitial } from "drizzle-orm/mysql-core/columns/int";
export declare let stormTagSchemaHelpers: {
    tagTableFactory: (name: string, id: () => MySqlIntBuilderInitial<any>) => import("drizzle-orm/mysql-core").MySqlTableWithColumns<{
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
    groupTagTableFactory: (name: string, id: () => MySqlIntBuilderInitial<any>, groupCol: MySqlColumnBuilder) => import("drizzle-orm/mysql-core").MySqlTableWithColumns<{
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
            groupId: import("drizzle-orm/mysql-core").MySqlColumn<{
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
    tagCols: (id: () => MySqlIntBuilderInitial<any>) => {
        id: MySqlIntBuilderInitial<any>;
        name: import("drizzle-orm").NotNull<import("drizzle-orm/mysql-core").MySqlVarCharBuilderInitial<"name", [string, ...string[]]>>;
    };
    groupTagCols: (id: () => MySqlIntBuilderInitial<any>, groupCol: MySqlColumnBuilder) => {
        id: MySqlIntBuilderInitial<any>;
        name: import("drizzle-orm").NotNull<import("drizzle-orm/mysql-core").MySqlVarCharBuilderInitial<"name", [string, ...string[]]>>;
        groupId: MySqlColumnBuilder<import("drizzle-orm").ColumnBuilderBaseConfig<import("drizzle-orm").ColumnDataType, string> & {
            data: any;
        }, object, object, import("drizzle-orm").ColumnBuilderExtraConfig>;
    };
};
