import {MySqlColumnBuilder, mysqlTable, varchar} from "drizzle-orm/mysql-core";
import {type MySqlIntBuilderInitial} from "drizzle-orm/mysql-core/columns/int";

export const tagCols = (id: () => MySqlIntBuilderInitial<any>) => {
	return {id: id(), name: varchar("name", {length: 255}).notNull().unique()};
};

export const groupTagCols = (id: () => MySqlIntBuilderInitial<any>, groupCol: MySqlColumnBuilder, fieldName: string = "groupId") => {
	let columns: Record<string, MySqlColumnBuilder> = {id: id(), name: varchar("name", {length: 255}).notNull().unique()};
	columns[fieldName] = groupCol;
	return columns;
};

export function tagTableFactory(name: string, id: () => MySqlIntBuilderInitial<any>) {
	let columns = tagCols(id);
	return mysqlTable(name, columns);
}

export function groupTagTableFactory(name: string, id: () => MySqlIntBuilderInitial<any>, groupCol: MySqlColumnBuilder, fieldName: string = "groupId") {
	let columns = groupTagCols(id, groupCol, fieldName);
	return mysqlTable(name, columns);
}