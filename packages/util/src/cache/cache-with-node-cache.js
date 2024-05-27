"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheWithNodeCache = void 0;
var cache_1 = require("./cache");
/**
 * CacheWithNodeCache is a class that extends the Cache class and provides caching functionality using NodeCache.
 *
 * @template T - The type of the cached items.
 */
var CacheWithNodeCache = /** @class */ (function (_super) {
    __extends(CacheWithNodeCache, _super);
    function CacheWithNodeCache(cache, ttl, prefix) {
        var _this = _super.call(this, ttl, prefix) || this;
        _this.cache = cache;
        return _this;
    }
    CacheWithNodeCache.prototype.get = function (key) {
        return Promise.resolve(Array.isArray(key)
            ? Object.values(this.cache.mget(this.key(key)))
            : this.cache.get(this.key(key)));
    };
    CacheWithNodeCache.prototype.set = function (items, ttl) {
        var _this = this;
        if (ttl === undefined)
            ttl = this.ttl;
        if (Array.isArray(items)) {
            var setWithTTL = items.map(function (item) { return { key: _this.key(item.key), val: item.value, ttl: ttl }; });
            this.cache.mset(setWithTTL);
        }
        else {
            var item = items;
            this.cache.set(this.key(item.key), item.value, ttl);
        }
        return Promise.resolve();
    };
    CacheWithNodeCache.prototype.del = function (key) {
        this.cache.del(this.key(key));
        return Promise.resolve();
    };
    /**
     * Clears all items from the cache.
     * @returns A Promise indicating the success of the operation.
     */
    CacheWithNodeCache.prototype.clear = function () {
        this.cache.flushAll();
        return Promise.resolve();
    };
    return CacheWithNodeCache;
}(cache_1.Cache));
exports.CacheWithNodeCache = CacheWithNodeCache;
