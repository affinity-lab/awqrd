'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var mysqlCore = require('drizzle-orm/mysql-core');

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var schema = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupTagTableFactory = exports.tagTableFactory = exports.groupTagCols = exports.tagCols = void 0;

const tagCols = (id) => {
    return { id: id(), name: (0, mysqlCore.varchar)("name", { length: 255 }).notNull().unique() };
};
exports.tagCols = tagCols;
const groupTagCols = (id, groupCol, fieldName = "groupId") => {
    let columns = { id: id(), name: (0, mysqlCore.varchar)("name", { length: 255 }).notNull().unique() };
    columns[fieldName] = groupCol;
    return columns;
};
exports.groupTagCols = groupTagCols;
function tagTableFactory(name, id) {
    let columns = (0, exports.tagCols)(id);
    return (0, mysqlCore.mysqlTable)(name, columns);
}
exports.tagTableFactory = tagTableFactory;
function groupTagTableFactory(name, id, groupCol, fieldName = "groupId") {
    let columns = (0, exports.groupTagCols)(id, groupCol, fieldName);
    return (0, mysqlCore.mysqlTable)(name, columns);
}
exports.groupTagTableFactory = groupTagTableFactory;
});

unwrapExports(schema);
schema.groupTagTableFactory;
schema.tagTableFactory;
schema.groupTagCols;
schema.tagCols;

var stormStorageSchemaFactory_1 = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.stormStorageSchemaFactory = void 0;

function stormStorageSchemaFactory(name = "_storage") {
    return (0, mysqlCore.mysqlTable)(name, {
        id: (0, mysqlCore.serial)("id").primaryKey(),
        name: (0, mysqlCore.varchar)("name", { length: 255 }).notNull(),
        itemId: (0, mysqlCore.int)("itemId").notNull(),
        data: (0, mysqlCore.json)("data").default("{}")
    }, (t) => ({
        unq: (0, mysqlCore.unique)().on(t.name, t.itemId)
    }));
}
exports.stormStorageSchemaFactory = stormStorageSchemaFactory;
});

unwrapExports(stormStorageSchemaFactory_1);
stormStorageSchemaFactory_1.stormStorageSchemaFactory;

var src = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.stormStorageSchemaFactory = exports.groupTagTableFactory = exports.groupTagCols = exports.tagTableFactory = exports.tagCols = exports.reference = exports.id = void 0;


Object.defineProperty(exports, "tagCols", { enumerable: true, get: function () { return schema.tagCols; } });
Object.defineProperty(exports, "tagTableFactory", { enumerable: true, get: function () { return schema.tagTableFactory; } });
Object.defineProperty(exports, "groupTagTableFactory", { enumerable: true, get: function () { return schema.groupTagTableFactory; } });
Object.defineProperty(exports, "groupTagCols", { enumerable: true, get: function () { return schema.groupTagCols; } });

Object.defineProperty(exports, "stormStorageSchemaFactory", { enumerable: true, get: function () { return stormStorageSchemaFactory_1.stormStorageSchemaFactory; } });
/**
 * Generates a definition for an auto-incrementing primary key column named 'id' in a MySQL database.
 * @returns A MySQL integer builder object with additional constraints for the 'id' column.
 */
function id() {
    return (0, mysqlCore.int)("id").autoincrement().primaryKey();
}
exports.id = id;
/**
 * Creates a reference column definition.
 * @param name - The name of the column.
 * @param field - A function that returns the reference field.
 * @param [nullable=false] - Indicates whether the column is nullable (default: false).
 * @returns  A reference column definition.
 */
function reference(name, field, nullable = false) {
    return nullable
        ? (0, mysqlCore.int)(name).references(field)
        : (0, mysqlCore.int)(name).notNull().references(field);
}
exports.reference = reference;
});

var index = unwrapExports(src);
var src_1 = src.stormStorageSchemaFactory;
var src_2 = src.groupTagTableFactory;
var src_3 = src.groupTagCols;
var src_4 = src.tagTableFactory;
var src_5 = src.tagCols;
var src_6 = src.reference;
var src_7 = src.id;

exports.default = index;
exports.groupTagCols = src_3;
exports.groupTagTableFactory = src_2;
exports.id = src_7;
exports.reference = src_6;
exports.stormStorageSchemaFactory = src_1;
exports.tagCols = src_5;
exports.tagTableFactory = src_4;
