'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var mysqlCore = require('drizzle-orm/mysql-core');
var schema = require('@affinity-lab/storm/dist/plugins/tag/helper/schema');
var stormStorageSchemaFactory = require('@affinity-lab/storm/dist/plugins/storage/helper/storm-storage-schema-factory');

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var src = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.stormStorageSchemaFactory = exports.groupTagTableFactory = exports.groupTagCols = exports.tagTableFactory = exports.tagCols = exports.reference = exports.id = void 0;


Object.defineProperty(exports, "tagCols", { enumerable: true, get: function () { return schema.tagCols; } });
Object.defineProperty(exports, "tagTableFactory", { enumerable: true, get: function () { return schema.tagTableFactory; } });
Object.defineProperty(exports, "groupTagTableFactory", { enumerable: true, get: function () { return schema.groupTagTableFactory; } });
Object.defineProperty(exports, "groupTagCols", { enumerable: true, get: function () { return schema.groupTagCols; } });

Object.defineProperty(exports, "stormStorageSchemaFactory", { enumerable: true, get: function () { return stormStorageSchemaFactory.stormStorageSchemaFactory; } });
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
