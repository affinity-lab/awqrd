"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupTagTableFactory = exports.tagTableFactory = exports.groupTagCols = exports.tagCols = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
const tagCols = (id) => {
    return { id: id(), name: (0, mysql_core_1.varchar)("name", { length: 255 }).notNull().unique() };
};
exports.tagCols = tagCols;
const groupTagCols = (id, groupCol, fieldName = "groupId") => {
    let columns = { id: id(), name: (0, mysql_core_1.varchar)("name", { length: 255 }).notNull().unique() };
    columns[fieldName] = groupCol;
    return columns;
};
exports.groupTagCols = groupTagCols;
function tagTableFactory(name, id) {
    let columns = (0, exports.tagCols)(id);
    return (0, mysql_core_1.mysqlTable)(name, columns);
}
exports.tagTableFactory = tagTableFactory;
function groupTagTableFactory(name, id, groupCol, fieldName = "groupId") {
    let columns = (0, exports.groupTagCols)(id, groupCol, fieldName);
    return (0, mysql_core_1.mysqlTable)(name, columns);
}
exports.groupTagTableFactory = groupTagTableFactory;
