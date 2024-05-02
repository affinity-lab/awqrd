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
var _Attachment_collection, _Attachment_entityId, _Attachment_name, _Attachment_id, _Attachment_size, _Attachment_metadata;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attachment = void 0;
class Attachment {
    get size() { return __classPrivateFieldGet(this, _Attachment_size, "f"); }
    get id() { return __classPrivateFieldGet(this, _Attachment_id, "f"); }
    get name() { return __classPrivateFieldGet(this, _Attachment_name, "f"); }
    get collection() { return __classPrivateFieldGet(this, _Attachment_collection, "f"); }
    get entityId() { return __classPrivateFieldGet(this, _Attachment_entityId, "f"); }
    constructor(attachmentObject, collection, entityId) {
        _Attachment_collection.set(this, void 0);
        _Attachment_entityId.set(this, void 0);
        _Attachment_name.set(this, void 0);
        _Attachment_id.set(this, void 0);
        _Attachment_size.set(this, void 0);
        _Attachment_metadata.set(this, void 0);
        __classPrivateFieldSet(this, _Attachment_entityId, entityId, "f");
        __classPrivateFieldSet(this, _Attachment_collection, collection, "f");
        __classPrivateFieldSet(this, _Attachment_name, attachmentObject.name, "f");
        __classPrivateFieldSet(this, _Attachment_id, attachmentObject.id, "f");
        __classPrivateFieldSet(this, _Attachment_size, attachmentObject.size, "f");
        __classPrivateFieldSet(this, _Attachment_metadata, attachmentObject.metadata, "f");
        this.metadata = new Proxy(__classPrivateFieldGet(this, _Attachment_metadata, "f"), {
            get: (target, prop) => target[prop.toString()],
            set: (target, prop, value) => {
                let p = prop.toString();
                if (collection.writableMetaFields.hasOwnProperty(p)) {
                    target[p] = value;
                    return true;
                }
                return false;
            }
        });
    }
    toJSON() {
        return {
            metadata: __classPrivateFieldGet(this, _Attachment_metadata, "f"),
            name: this.name,
            id: this.id,
            size: __classPrivateFieldGet(this, _Attachment_size, "f"),
        };
    }
    saveMetaData() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.collection.storage.updateMetadata(this.collection.name, this.entityId, this.name, __classPrivateFieldGet(this, _Attachment_metadata, "f"));
        });
    }
    setPositions(position) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.collection.storage.setPosition(this.collection.name, this.entityId, this.name, position);
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.collection.storage.delete(this.collection.name, this.entityId, this.name);
        });
    }
    rename(name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.collection.storage.rename(this.collection.name, this.entityId, this.name, name);
        });
    }
}
exports.Attachment = Attachment;
_Attachment_collection = new WeakMap(), _Attachment_entityId = new WeakMap(), _Attachment_name = new WeakMap(), _Attachment_id = new WeakMap(), _Attachment_size = new WeakMap(), _Attachment_metadata = new WeakMap();
