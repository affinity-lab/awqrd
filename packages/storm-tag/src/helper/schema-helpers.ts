import {MySqlColumnBuilder, mysqlTable, varchar} from "drizzle-orm/mysql-core";
import {type MySqlIntBuilderInitial} from "drizzle-orm/mysql-core/columns/int";

export let stormTagSchemaHelpers = {
	tagTableFactory: function (name: string, id: () => MySqlIntBuilderInitial<any>) {
		let columns = this.tagCols(id);
		return mysqlTable(name, columns);
	},
	groupTagTableFactory: function (name: string, id: () => MySqlIntBuilderInitial<any>, groupCol: MySqlColumnBuilder) {
		let columns = this.groupTagCols(id, groupCol);
		return mysqlTable(name, columns);
	},
	tagCols: function (id: () => MySqlIntBuilderInitial<any>) {
		return {id: id(), name: varchar("name", {length: 255}).notNull().unique()};
	},
	groupTagCols: function (id: () => MySqlIntBuilderInitial<any>, groupCol: MySqlColumnBuilder) {
		return {id: id(), name: varchar("name", {length: 255}).notNull().unique(), groupId: groupCol};
	}
}