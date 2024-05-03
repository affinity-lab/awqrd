"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stormStorageSchemaFactory = exports.groupTagTableFactory = exports.groupTagCols = exports.tagTableFactory = exports.tagCols = exports.reference = exports.id = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
const schema_1 = require("@affinity-lab/storm/dist/plugins/tag/helper/schema");
Object.defineProperty(exports, "tagCols", { enumerable: true, get: function () { return schema_1.tagCols; } });
Object.defineProperty(exports, "tagTableFactory", { enumerable: true, get: function () { return schema_1.tagTableFactory; } });
Object.defineProperty(exports, "groupTagTableFactory", { enumerable: true, get: function () { return schema_1.groupTagTableFactory; } });
Object.defineProperty(exports, "groupTagCols", { enumerable: true, get: function () { return schema_1.groupTagCols; } });
const storm_storage_schema_factory_1 = require("@affinity-lab/storm/dist/plugins/storage/helper/storm-storage-schema-factory");
Object.defineProperty(exports, "stormStorageSchemaFactory", { enumerable: true, get: function () { return storm_storage_schema_factory_1.stormStorageSchemaFactory; } });
/**
 * Generates a definition for an auto-incrementing primary key column named 'id' in a MySQL database.
 * @returns A MySQL integer builder object with additional constraints for the 'id' column.
 */
function id() {
    return (0, mysql_core_1.int)("id").autoincrement().primaryKey();
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
        ? (0, mysql_core_1.int)(name).references(field)
        : (0, mysql_core_1.int)(name).notNull().references(field);
}
exports.reference = reference;
