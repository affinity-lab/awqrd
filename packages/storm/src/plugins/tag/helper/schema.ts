import {MySqlColumnBuilder, mysqlTable, varchar} from "drizzle-orm/mysql-core";
import {type MySqlIntBuilderInitial} from "drizzle-orm/mysql-core/columns/int";

/**
 * generate columns for tags
 * @param id
 */
export const tagCols = (id: () => MySqlIntBuilderInitial<any>) => {
	return {id: id(), name: varchar("name", {length: 255}).notNull().unique()};
};

/**
 * generate columns for group tags
 * @param id
 * @param groupCol
 * @param fieldName
 */
export const groupTagCols = (id: () => MySqlIntBuilderInitial<any>, groupCol: MySqlColumnBuilder, fieldName: string = "groupId") => {
	let columns: Record<string, MySqlColumnBuilder> = {id: id(), name: varchar("name", {length: 255}).notNull().unique()};
	columns[fieldName] = groupCol;
	return columns;
};


/**
 * generate a table for tags
 * @param name
 * @param id
 */
export function tagTableFactory(name: string, id: () => MySqlIntBuilderInitial<any>) {
	let columns = tagCols(id);
	return mysqlTable(name, columns);
}

/**
 * generate a table for group tags
 * @param name
 * @param id
 * @param groupCol
 * @param fieldName
 */
export function groupTagTableFactory(name: string, id: () => MySqlIntBuilderInitial<any>, groupCol: MySqlColumnBuilder, fieldName: string = "groupId") {
	let columns = groupTagCols(id, groupCol, fieldName);
	return mysqlTable(name, columns);
}