"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getByFactory = exports.likeString = exports.stmt = exports.In = void 0;
const drizzle_orm_1 = require("drizzle-orm");
/**
 * Creates an SQL expression for checking if a column's value is in a list of IDs.
 * @param col - The column to check.
 * @param ids - The list of IDs.
 * @returns An SQL expression.
 */
function In(col, ids) { return (0, drizzle_orm_1.sql) `${col} in (${drizzle_orm_1.sql.placeholder(ids)})`; }
exports.In = In;
/**
 * Executes a MySQL SELECT statement asynchronously, applying multiple processing functions to the result.
 * @template ARGS - Type of the arguments accepted by the MySQL SELECT statement.
 * @template RES - Type of the result returned by the processing functions.
 * @param stmt - The MySQL SELECT statement object.
 * @param processes - Processing functions to be applied to the result sequentially.
 * @returns A promise that resolves with a function accepting arguments of type ARGS and returning a result of type RES.
 */
function stmt(stmt, ...processes) {
    let prepared = stmt.prepare();
    return (args) => __awaiter(this, void 0, void 0, function* () {
        let result = yield prepared.execute(args);
        for (const process of processes)
            result = yield process(result);
        return result;
    });
}
exports.stmt = stmt;
/**
 * Set of utility functions to generate SQL LIKE query patterns for string matching.
 */
exports.likeString = {
    /**
     * Generates a SQL LIKE query pattern to match strings that start with the specified search string.
     * @param search - The string to match within.
     * @returns A SQL LIKE query pattern.
     */
    startsWith: (search) => search + "%",
    /**
     * Generates a SQL LIKE query pattern to match strings that end with the specified search string.
     * @param search - The string to match within.
     * @returns A SQL LIKE query pattern.
     */
    endWith: (search) => "%" + search,
    /**
     * Generates a SQL LIKE query pattern to match strings that contain the specified search string.
     * @param search - The string to match within.
     * @returns A SQL LIKE query pattern.
     */
    contains: (search) => "%" + search + "%",
};
function getByFactory(repo, fieldName) {
    let field = repo.schema[fieldName];
    let stmt = repo.db.select().from(repo.schema).where((0, drizzle_orm_1.eq)(field, drizzle_orm_1.sql.placeholder("search"))).prepare();
    let fn = (search) => __awaiter(this, void 0, void 0, function* () {
        let data = yield stmt.execute({ search });
        if (data.length === 0)
            return undefined;
        else
            return yield repo.instantiators.first(data);
    });
    fn.stmt = stmt;
    return fn;
}
exports.getByFactory = getByFactory;
