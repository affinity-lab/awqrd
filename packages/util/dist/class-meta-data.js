"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassMetaData = exports.MetaValue = exports.MetaDataStore = void 0;
const uni_flatten_1 = require("uni-flatten");
class ObjectStore {
    constructor() {
        this.value = {};
    }
}
class SingleStore {
}
class ArrayStore {
    constructor() {
        this.value = [];
    }
}
/**
 * Class to store metadata for a class
 * @class MetaDataStore
 */
class MetaDataStore {
    /**
     * @constructor
     * @param target
     */
    constructor(target) {
        this.target = target;
        /**
         * @type {ClassMetaDataStore}
         * @description The metadata records
         */
        this.records = {};
    }
    /**
     * Merge metadata
     * @param key
     * @param value
     */
    merge(key, value) {
        key = this.key(key);
        if (!this.records.hasOwnProperty(key))
            this.records[key] = new ObjectStore();
        if (!(this.records[key] instanceof ObjectStore))
            throw `Metadata ${key} on ${this.target} type mismatch error!`;
        this.records[key].value = Object.assign(Object.assign({}, (this.records[key].value)), value);
    }
    /**
     * Set metadata
     * @param key
     * @param value
     */
    set(key, value) {
        key = this.key(key);
        if (!this.records.hasOwnProperty(key))
            this.records[key] = new SingleStore();
        if (!(this.records[key] instanceof SingleStore))
            throw `Metadata ${key} on ${this.target} type mismatch error!`;
        this.records[key].value = value;
    }
    /**
     * Push metadata
     * @param key
     * @param value
     */
    push(key, value) {
        key = this.key(key);
        if (!this.records.hasOwnProperty(key))
            this.records[key] = new ArrayStore();
        if (!(this.records[key] instanceof ArrayStore))
            throw `Metadata ${key} on ${this.target} type mismatch error!`;
        this.records[key].value.push(value);
    }
    /**
     * Delete metadata
     * @param key
     */
    delete(key) { delete (this.records[this.key(key)]); }
    key(key) { return Array.isArray(key) ? key.join(".") : key; }
}
exports.MetaDataStore = MetaDataStore;
/**
 * Class to store metadata for classes
 */
class MetaValue {
    constructor(store, self = false) {
        this.store = store;
        this.self = undefined;
        this.inherited = [];
        if (this.store instanceof ArrayStore) {
            this.value = [...store.value];
            if (self)
                this.self = [...store.value];
        }
        else if (this.store instanceof ObjectStore) {
            this.value = Object.assign({}, store.value);
            if (self)
                this.self = Object.assign({}, store.value);
        }
        else {
            this.value = store.value;
            if (self)
                this.self = store.value;
        }
        this.inherited.push(store.value);
    }
    addInherited(value) {
        this.inherited.push(value);
        if (this.store instanceof ArrayStore)
            this.value.push(...value);
        else if (this.store instanceof ObjectStore)
            Object.assign(this.value, value);
    }
}
exports.MetaValue = MetaValue;
/**
 * Class to store metadata for classes
 */
class ClassMetaData {
    constructor() {
        /**
         * @type {Array<MetaDataStore>} stores - The metadata stores
         */
        this.stores = [];
    }
    get(target, create = false) {
        for (const store of this.stores)
            if (store.target === target)
                return store;
        const store = new MetaDataStore(target);
        if (create)
            this.stores.push(store);
        return store;
    }
    /**
     * Read metadata for a class
     * @param target
     * @param options
     */
    read(target, options = {}) {
        options = Object.assign({ flatten: false, simple: true }, options);
        const result = {};
        let store = this.get(target);
        if (store !== undefined) {
            for (const key in store.records) {
                result[key] = new MetaValue(store.records[key], true);
            }
        }
        target = Object.getPrototypeOf(target);
        while (target !== Object.prototype) {
            store = this.get(target);
            if (store !== undefined) {
                for (const key in store.records) {
                    if (result.hasOwnProperty(key)) {
                        result[key].addInherited(store.records[key].value);
                    }
                    else {
                        result[key] = new MetaValue(store.records[key]);
                    }
                }
            }
            target = Object.getPrototypeOf(target);
        }
        if (options.simple) {
            for (const key in result) {
                result[key] = result[key].value;
            }
        }
        return options.flatten ? result : (0, uni_flatten_1.unflatten)(result);
    }
}
exports.ClassMetaData = ClassMetaData;
