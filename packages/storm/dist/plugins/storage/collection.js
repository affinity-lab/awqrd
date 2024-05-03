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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collection = void 0;
const fs_1 = __importDefault(require("fs"));
const minimatch_1 = require("minimatch");
const path_1 = __importDefault(require("path"));
const util_1 = require("@affinity-lab/util");
const attachment_1 = require("./attachment");
const collection_handler_1 = require("./collection-handler");
const error_1 = require("./helper/error");
const mimetype_map_1 = require("./helper/mimetype-map");
class Collection {
    get storage() { return this._storage; }
    constructor(name, groupDefinition, rules) {
        var _a;
        this.name = name;
        this.groupDefinition = groupDefinition;
        this.writableMetaFields = {};
        this._storage = groupDefinition.storage;
        this.group = groupDefinition.group;
        this.name = `${this.group}.${this.name}`;
        this.entityRepository = groupDefinition.entityRepository;
        // if it was a string cast it to array
        if (typeof rules.ext === "string")
            rules.ext = [rules.ext];
        if (typeof rules.mime === "string")
            rules.mime = [rules.mime];
        if (typeof rules.limit === "undefined")
            rules.limit = {};
        if (typeof rules.limit.count === "undefined")
            rules.limit.count = 1;
        if (typeof rules.limit.size === "undefined")
            rules.limit.size = '1mb';
        rules.limit.size = (0, util_1.bytes)(rules.limit.size);
        this.rules = rules;
        if (this.rules.mime !== undefined) {
            if (!Array.isArray(this.rules.ext))
                this.rules.ext = [];
            for (const mime of this.rules.mime) {
                for (const ext in mimetype_map_1.mimeTypeMap) {
                    if ((0, minimatch_1.minimatch)(mimetype_map_1.mimeTypeMap[ext], mime))
                        this.rules.ext.push(ext);
                }
            }
            if (((_a = rules.ext) === null || _a === void 0 ? void 0 : _a.length) === 0)
                rules.ext = undefined;
        }
        this._storage.addCollection(this);
    }
    handler(entity) {
        return entity.id ? new collection_handler_1.CollectionHandler(this, entity) : undefined;
    }
    updateMetadata(id, filename, metadata) {
        return __awaiter(this, void 0, void 0, function* () { yield this._storage.updateMetadata(this.name, id, filename, metadata); });
    }
    prepareFile(file) {
        return __awaiter(this, void 0, void 0, function* () { return { file, metadata: {} }; });
    }
    prepare(collectionHandler, file) {
        return __awaiter(this, void 0, void 0, function* () {
            let metadata;
            const ext = path_1.default.extname(file.filename);
            const filename = path_1.default.basename(file.filename);
            const stat = yield fs_1.default.promises.stat(file.file);
            let id = collectionHandler.id;
            // check if entity exists
            if ((yield this.entityRepository.get(id)) === undefined)
                throw error_1.storageError.ownerNotExists(this.name, id);
            // check limit
            if (collectionHandler.length >= this.rules.limit.count) {
                throw error_1.storageError.tooManyFiles(this.name, id, filename, this.rules.limit.count);
            }
            // check extension
            if (this.rules.ext !== undefined && !this.rules.ext.includes(ext)) {
                throw error_1.storageError.extensionNotAllowed(this.name, id, filename, this.rules.ext);
            }
            // prepare (modify, replace, whatever) the file
            ({ file, metadata } = yield this.prepareFile(file));
            // check size
            let size = stat.size;
            if (size > this.rules.limit.size) {
                throw error_1.storageError.fileTooLarge(this.name, id, filename, this.rules.limit.size);
            }
            return { file, metadata };
        });
    }
    onDelete() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    onModify() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let attachmentObjects = yield this._storage.get(this.name, id);
            return attachmentObjects.map(attachmentObject => new attachment_1.Attachment(attachmentObject, this, id));
        });
    }
}
exports.Collection = Collection;
