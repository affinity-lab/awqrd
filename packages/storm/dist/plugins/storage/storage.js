"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Storage = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const helper_1 = require("../../helper");
const util_1 = require("@affinity-lab/util");
const util_2 = require("@affinity-lab/util");
const util_3 = require("@affinity-lab/util");
const util_4 = require("@affinity-lab/util");
const util_5 = require("@affinity-lab/util");
const error_1 = require("./helper/error");
class Storage {
    constructor(path, db, schema, cache, cleanup) {
        this.path = path;
        this.db = db;
        this.schema = schema;
        this.cache = cache;
        this.cleanup = cleanup;
        this.collections = {};
    }
    addCollection(collection) {
        if (this.collections[collection.name] !== undefined)
            throw new Error(`collection name must be unique! ${collection.name}`);
        this.collections[collection.name] = collection;
    }
    getGroupDefinition(name, entityRepository) {
        return {
            storage: this,
            group: name,
            entityRepository
        };
    }
    get stmt_get() {
        return (0, helper_1.stmt)(this.db.select().from(this.schema).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.sql) `name = ${drizzle_orm_1.sql.placeholder("name")}`, (0, drizzle_orm_1.sql) `itemId = ${drizzle_orm_1.sql.placeholder("id")}`)).limit(1), util_5.firstOrUndefined);
    }
    get stmt_all() {
        return (0, helper_1.stmt)(this.db.select().from(this.schema).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.sql) `itemId IN (${drizzle_orm_1.sql.placeholder("ids")})`, (0, drizzle_orm_1.sql) `name = ${drizzle_orm_1.sql.placeholder("name")}`)));
    }
    get stmt_del() {
        return (0, helper_1.stmt)(this.db.delete(this.schema).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.sql) `itemId = (${drizzle_orm_1.sql.placeholder("id")})`, (0, drizzle_orm_1.sql) `name = ${drizzle_orm_1.sql.placeholder("name")}`)));
    }
    getPath(name, id) { return path_1.default.resolve(this.path, name, id.toString(36).padStart(6, "0").match(/.{1,2}/g).join("/")); }
    getCacheKey(name, id) { return `${name}-${id}`; }
    get(name_1, id_1) {
        return __awaiter(this, arguments, void 0, function* (name, id, res = {}) {
            var _a, _b;
            let record = yield ((_a = this.cache) === null || _a === void 0 ? void 0 : _a.get(this.getCacheKey(name, id)));
            if (record) {
                res.found = "cache";
                return JSON.parse(record.data);
            }
            record = yield this.stmt_get({ name, id });
            if (record) {
                res.found = "db";
                (_b = this.cache) === null || _b === void 0 ? void 0 : _b.set({ key: this.getCacheKey(name, id), value: record });
                return JSON.parse(record.data);
            }
            return [];
        });
    }
    getIndexOfAttachments(name_1, id_1, filename_1) {
        return __awaiter(this, arguments, void 0, function* (name, id, filename, fail = false) {
            const attachments = yield this.get(name, id);
            const idx = attachments.findIndex(a => a.name === filename);
            if (idx === -1 && fail)
                throw error_1.storageError.attachedFileNotFound(name, id, filename);
            return { attachments, index: idx };
        });
    }
    destroy(repository, id) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const collectionsKey in this.collections) {
                yield this.destroyFiles(collectionsKey, id);
            }
        });
    }
    destroyFiles(name, id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            (_a = this.cache) === null || _a === void 0 ? void 0 : _a.del(this.getCacheKey(name, id));
            yield this.stmt_del({ name, id });
            const path = this.getPath(name, id);
            if (yield (0, util_1.fileExists)(path)) {
                const files = yield fs_1.default.promises.readdir(path);
                files.map((file) => __awaiter(this, void 0, void 0, function* () {
                    yield fs_1.default.promises.unlink(path_1.default.join(path, file));
                    if (this.cleanup !== undefined)
                        yield this.cleanup(name, id, file);
                }));
                yield (0, util_3.removeEmptyParentDirectories)(path);
            }
        });
    }
    updateRecord(name, id, attachments) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            (_a = this.cache) === null || _a === void 0 ? void 0 : _a.del(this.getCacheKey(name, id));
            yield this.db.update(this.schema)
                .set({ data: JSON.stringify(attachments) })
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)((0, drizzle_orm_1.sql) `itemId`, drizzle_orm_1.sql.placeholder("id")), (0, drizzle_orm_1.eq)((0, drizzle_orm_1.sql) `name`, drizzle_orm_1.sql.placeholder("name"))))
                .execute({ name, id });
        });
    }
    add(name, id, file, metadata) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let path = this.getPath(name, id);
            let filename = path_1.default.basename(file.filename);
            filename = (0, util_4.sanitizeFilename)(filename);
            filename = yield (0, util_1.getUniqueFilename)(path, filename);
            yield fs_1.default.promises.mkdir(path, { recursive: true });
            yield fs_1.default.promises.copyFile(file.file, path_1.default.join(path, filename));
            let res = { found: false };
            const attachments = yield this.get(name, id, res);
            attachments.push({
                name: filename,
                size: (yield fs_1.default.promises.stat(file.file)).size,
                id: crypto.randomUUID(),
                metadata
            });
            if (res.found === false) {
                yield this.db.insert(this.schema).values({ name, itemId: id, data: JSON.stringify(attachments) }).execute();
            }
            else {
                yield this.db.update(this.schema).set({ data: JSON.stringify(attachments) }).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.sql) `name = ${drizzle_orm_1.sql.placeholder("name")}`, (0, drizzle_orm_1.sql) `itemId = ${drizzle_orm_1.sql.placeholder("id")}`)).execute({ name, id });
                (_a = this.cache) === null || _a === void 0 ? void 0 : _a.del(this.getCacheKey(name, id));
            }
            file.release();
        });
    }
    delete(name, id, filename) {
        return __awaiter(this, void 0, void 0, function* () {
            let { attachments, index } = yield this.getIndexOfAttachments(name, id, filename, true);
            attachments.splice(index, 1);
            yield this.updateRecord(name, id, attachments);
            const path = this.getPath(name, id);
            yield fs_1.default.promises.unlink(path_1.default.resolve(path, filename));
            yield (0, util_3.removeEmptyParentDirectories)(path);
        });
    }
    setPosition(name, id, filename, position) {
        return __awaiter(this, void 0, void 0, function* () {
            const attachments = yield this.get(name, id);
            const idx = attachments.findIndex(a => a.name === filename);
            if (idx === -1)
                throw error_1.storageError.attachedFileNotFound(name, id, filename);
            if (idx === position)
                return;
            attachments.splice(position, 0, ...attachments.splice(idx, 1));
            yield this.updateRecord(name, id, attachments);
        });
    }
    updateMetadata(name, id, filename, metadata) {
        return __awaiter(this, void 0, void 0, function* () {
            const attachments = yield this.get(name, id);
            const idx = attachments.findIndex(a => a.name === filename);
            if (idx === -1)
                throw error_1.storageError.attachedFileNotFound(name, id, filename);
            attachments[idx].metadata = Object.assign(Object.assign({}, attachments[idx].metadata), metadata);
            yield this.updateRecord(name, id, attachments);
        });
    }
    rename(name, id, filename, newName) {
        return __awaiter(this, void 0, void 0, function* () {
            const attachments = yield this.get(name, id);
            const idx = attachments.findIndex(a => a.name === filename);
            if (idx === -1)
                throw error_1.storageError.attachedFileNotFound(name, id, filename);
            let path = this.getPath(name, id);
            newName = (0, util_4.sanitizeFilename)(newName);
            newName = yield (0, util_1.getUniqueFilename)(path, newName);
            attachments[idx].name = newName;
            yield fs_1.default.promises.rename(path_1.default.join(path, filename), path_1.default.join(path, newName));
            yield this.updateRecord(name, id, attachments);
        });
    }
}
exports.Storage = Storage;
__decorate([
    util_2.MaterializeIt
], Storage.prototype, "stmt_get", null);
__decorate([
    util_2.MaterializeIt
], Storage.prototype, "stmt_all", null);
__decorate([
    util_2.MaterializeIt
], Storage.prototype, "stmt_del", null);
