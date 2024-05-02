define("storm/src/plugins/tag/helper/schema", ["require", "exports", "drizzle-orm/mysql-core"], function (require, exports, mysql_core_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.groupTagTableFactory = exports.tagTableFactory = exports.groupTagCols = exports.tagCols = void 0;
    var tagCols = function (id) {
        return { id: id(), name: (0, mysql_core_1.varchar)("name", { length: 255 }).notNull().unique() };
    };
    exports.tagCols = tagCols;
    var groupTagCols = function (id, groupCol, fieldName) {
        if (fieldName === void 0) { fieldName = "groupId"; }
        var columns = { id: id(), name: (0, mysql_core_1.varchar)("name", { length: 255 }).notNull().unique() };
        columns[fieldName] = groupCol;
        return columns;
    };
    exports.groupTagCols = groupTagCols;
    function tagTableFactory(name, id) {
        var columns = (0, exports.tagCols)(id);
        return (0, mysql_core_1.mysqlTable)(name, columns);
    }
    exports.tagTableFactory = tagTableFactory;
    function groupTagTableFactory(name, id, groupCol, fieldName) {
        if (fieldName === void 0) { fieldName = "groupId"; }
        var columns = (0, exports.groupTagCols)(id, groupCol, fieldName);
        return (0, mysql_core_1.mysqlTable)(name, columns);
    }
    exports.groupTagTableFactory = groupTagTableFactory;
});
define("storm/src/plugins/storage/helper/storm-storage-schema-factory", ["require", "exports", "drizzle-orm/mysql-core"], function (require, exports, mysql_core_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.stormStorageSchemaFactory = void 0;
    function stormStorageSchemaFactory(name) {
        if (name === void 0) { name = "_storage"; }
        return (0, mysql_core_2.mysqlTable)(name, {
            id: (0, mysql_core_2.serial)("id").primaryKey(),
            name: (0, mysql_core_2.varchar)("name", { length: 255 }).notNull(),
            itemId: (0, mysql_core_2.int)("itemId").notNull(),
            data: (0, mysql_core_2.json)("data").default("{}")
        }, function (t) { return ({
            unq: (0, mysql_core_2.unique)().on(t.name, t.itemId)
        }); });
    }
    exports.stormStorageSchemaFactory = stormStorageSchemaFactory;
});
define("schema-helper/src/index", ["require", "exports", "drizzle-orm/mysql-core"], function (require, exports, mysql_core_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.reference = exports.id = void 0;
    /**
     * Generates a definition for an auto-incrementing primary key column named 'id' in a MySQL database.
     * @returns A MySQL integer builder object with additional constraints for the 'id' column.
     */
    function id() {
        return (0, mysql_core_3.int)("id").autoincrement().primaryKey();
    }
    exports.id = id;
    /**
     * Creates a reference column definition.
     * @param name - The name of the column.
     * @param field - A function that returns the reference field.
     * @param [nullable=false] - Indicates whether the column is nullable (default: false).
     * @returns  A reference column definition.
     */
    function reference(name, field, nullable) {
        if (nullable === void 0) { nullable = false; }
        return nullable
            ? (0, mysql_core_3.int)(name).references(field)
            : (0, mysql_core_3.int)(name).notNull().references(field);
    }
    exports.reference = reference;
});
// Export additional functions from other modules if needed
