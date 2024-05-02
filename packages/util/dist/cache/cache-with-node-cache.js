"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheWithNodeCache = void 0;
const cache_1 = require("./cache");
/**
 * CacheWithNodeCache is a class that extends the Cache class and provides caching functionality using NodeCache.
 *
 * @template T - The type of the cached items.
 */
class CacheWithNodeCache extends cache_1.Cache {
    constructor(cache, ttl, prefix) {
        super(ttl, prefix);
        this.cache = cache;
    }
    get(key) {
        return Promise.resolve(Array.isArray(key)
            ? Object.values(this.cache.mget(this.key(key)))
            : this.cache.get(this.key(key)));
    }
    set(items, ttl) {
        if (ttl === undefined)
            ttl = this.ttl;
        if (Array.isArray(items)) {
            const setWithTTL = items.map(item => { return { key: this.key(item.key), val: item.value, ttl }; });
            this.cache.mset(setWithTTL);
        }
        else {
            const item = items;
            this.cache.set(this.key(item.key), item.value, ttl);
        }
        return Promise.resolve();
    }
    del(key) {
        this.cache.del(this.key(key));
        return Promise.resolve();
    }
    /**
     * Clears all items from the cache.
     * @returns A Promise indicating the success of the operation.
     */
    clear() {
        this.cache.flushAll();
        return Promise.resolve();
    }
}
exports.CacheWithNodeCache = CacheWithNodeCache;
