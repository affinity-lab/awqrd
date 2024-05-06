import { mysqlTable, varchar } from "drizzle-orm/mysql-core";
export const tagCols = (id) => {
    return { id: id(), name: varchar("name", { length: 255 }).notNull().unique() };
};
export const groupTagCols = (id, groupCol, fieldName = "groupId") => {
    let columns = { id: id(), name: varchar("name", { length: 255 }).notNull().unique() };
    columns[fieldName] = groupCol;
    return columns;
};
export function tagTableFactory(name, id) {
    let columns = tagCols(id);
    return mysqlTable(name, columns);
}
export function groupTagTableFactory(name, id, groupCol, fieldName = "groupId") {
    let columns = groupTagCols(id, groupCol, fieldName);
    return mysqlTable(name, columns);
}
