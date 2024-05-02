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
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _CollectionHandler_collection, _CollectionHandler_entity;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionHandler = void 0;
const minimatch_1 = require("minimatch");
class CollectionHandler extends Array {
    get entity() { return __classPrivateFieldGet(this, _CollectionHandler_entity, "f"); }
    get id() { return __classPrivateFieldGet(this, _CollectionHandler_entity, "f").id; }
    get collection() { return __classPrivateFieldGet(this, _CollectionHandler_collection, "f"); }
    get storage() { return __classPrivateFieldGet(this, _CollectionHandler_collection, "f").storage; }
    constructor(collection, entity) {
        super();
        _CollectionHandler_collection.set(this, void 0);
        _CollectionHandler_entity.set(this, void 0);
        this.loaded = false;
        __classPrivateFieldSet(this, _CollectionHandler_collection, collection, "f");
        __classPrivateFieldSet(this, _CollectionHandler_entity, entity, "f");
    }
    push(...args) { throw Error(`can not push into collection handler ${this.collection.name}`); }
    unshift(...args) { throw Error(`can not unshift collection handler ${this.collection.name}`); }
    pop() { throw Error(`can not pop from collection handler ${this.collection.name}`); }
    shift() { throw Error(`can not shift from collection handler ${this.collection.name}`); }
    load() {
        const _super = Object.create(null, {
            push: { get: () => super.push }
        });
        return __awaiter(this, void 0, void 0, function* () {
            // todo: make proper update instead of this
            this.loaded = true;
            this.length = 0;
            _super.push.call(this, ...(yield this.collection.get(this.entity.id)));
            return this;
        });
    }
    add(file) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.load();
            const prepared = yield this.collection.prepare(this, file);
            yield this.collection.storage.add(this.collection.name, this.entity.id, prepared.file, prepared.metadata);
            prepared.file.release();
            yield this.load();
        });
    }
    toJSON() {
        return {
            collection: this.collection.name,
            id: this.id,
            files: this.loaded ? [...this] : null
        };
    }
    first() { return this.at(0); }
    last() { return this.at(-1); }
    findFile(filename) { return this.find(obj => filename === obj.name); }
    findFiles(glob) { return this.filter(obj => (0, minimatch_1.minimatch)(obj.name, glob)); }
}
exports.CollectionHandler = CollectionHandler;
_CollectionHandler_collection = new WeakMap(), _CollectionHandler_entity = new WeakMap();
