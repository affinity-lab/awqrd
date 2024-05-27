"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassMetaData = exports.MetaValue = exports.MetaDataStore = void 0;
var uni_flatten_1 = require("uni-flatten");
var ObjectStore = /** @class */ (function () {
    function ObjectStore() {
        this.value = {};
    }
    return ObjectStore;
}());
var SingleStore = /** @class */ (function () {
    function SingleStore() {
    }
    return SingleStore;
}());
var ArrayStore = /** @class */ (function () {
    function ArrayStore() {
        this.value = [];
    }
    return ArrayStore;
}());
/**
 * Class to store metadata for a class
 * @class MetaDataStore
 */
var MetaDataStore = /** @class */ (function () {
    /**
     * @constructor
     * @param target
     */
    function MetaDataStore(target) {
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
    MetaDataStore.prototype.merge = function (key, value) {
        key = this.key(key);
        if (!this.records.hasOwnProperty(key))
            this.records[key] = new ObjectStore();
        if (!(this.records[key] instanceof ObjectStore))
            throw "Metadata ".concat(key, " on ").concat(this.target, " type mismatch error!");
        this.records[key].value = __assign(__assign({}, (this.records[key].value)), value);
    };
    /**
     * Set metadata
     * @param key
     * @param value
     */
    MetaDataStore.prototype.set = function (key, value) {
        key = this.key(key);
        if (!this.records.hasOwnProperty(key))
            this.records[key] = new SingleStore();
        if (!(this.records[key] instanceof SingleStore))
            throw "Metadata ".concat(key, " on ").concat(this.target, " type mismatch error!");
        this.records[key].value = value;
    };
    /**
     * Push metadata
     * @param key
     * @param value
     */
    MetaDataStore.prototype.push = function (key, value) {
        key = this.key(key);
        if (!this.records.hasOwnProperty(key))
            this.records[key] = new ArrayStore();
        if (!(this.records[key] instanceof ArrayStore))
            throw "Metadata ".concat(key, " on ").concat(this.target, " type mismatch error!");
        this.records[key].value.push(value);
    };
    /**
     * Delete metadata
     * @param key
     */
    MetaDataStore.prototype.delete = function (key) { delete (this.records[this.key(key)]); };
    MetaDataStore.prototype.key = function (key) { return Array.isArray(key) ? key.join(".") : key; };
    return MetaDataStore;
}());
exports.MetaDataStore = MetaDataStore;
/**
 * Class to store metadata for classes
 */
var MetaValue = /** @class */ (function () {
    function MetaValue(store, self) {
        if (self === void 0) { self = false; }
        this.store = store;
        this.self = undefined;
        this.inherited = [];
        if (this.store instanceof ArrayStore) {
            this.value = __spreadArray([], store.value, true);
            if (self)
                this.self = __spreadArray([], store.value, true);
        }
        else if (this.store instanceof ObjectStore) {
            this.value = __assign({}, store.value);
            if (self)
                this.self = __assign({}, store.value);
        }
        else {
            this.value = store.value;
            if (self)
                this.self = store.value;
        }
        this.inherited.push(store.value);
    }
    MetaValue.prototype.addInherited = function (value) {
        var _a;
        this.inherited.push(value);
        if (this.store instanceof ArrayStore)
            (_a = this.value).push.apply(_a, value);
        else if (this.store instanceof ObjectStore)
            Object.assign(this.value, value);
    };
    return MetaValue;
}());
exports.MetaValue = MetaValue;
/**
 * Class to store metadata for classes
 */
var ClassMetaData = /** @class */ (function () {
    function ClassMetaData() {
        /**
         * @type {Array<MetaDataStore>} stores - The metadata stores
         */
        this.stores = [];
    }
    ClassMetaData.prototype.get = function (target, create) {
        if (create === void 0) { create = false; }
        for (var _i = 0, _a = this.stores; _i < _a.length; _i++) {
            var store_1 = _a[_i];
            if (store_1.target === target)
                return store_1;
        }
        var store = new MetaDataStore(target);
        if (create)
            this.stores.push(store);
        return store;
    };
    /**
     * Read metadata for a class
     * @param target
     * @param options
     */
    ClassMetaData.prototype.read = function (target, options) {
        if (options === void 0) { options = {}; }
        options = __assign({ flatten: false, simple: true }, options);
        var result = {};
        var store = this.get(target);
        if (store !== undefined) {
            for (var key in store.records) {
                result[key] = new MetaValue(store.records[key], true);
            }
        }
        target = Object.getPrototypeOf(target);
        while (target !== Object.prototype) {
            store = this.get(target);
            if (store !== undefined) {
                for (var key in store.records) {
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
            for (var key in result) {
                result[key] = result[key].value;
            }
        }
        return options.flatten ? result : (0, uni_flatten_1.unflatten)(result);
    };
    return ClassMetaData;
}());
exports.ClassMetaData = ClassMetaData;
