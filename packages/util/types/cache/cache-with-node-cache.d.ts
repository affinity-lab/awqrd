import NodeCache from "node-cache";
import { type KeyValue, Cache } from "./cache";
/**
 * CacheWithNodeCache is a class that extends the Cache class and provides caching functionality using NodeCache.
 *
 * @template T - The type of the cached items.
 */
export declare class CacheWithNodeCache<T = any> extends Cache<T> {
    private cache;
    constructor(cache: NodeCache, ttl: number, prefix?: string);
    /**
     * Retrieves cached item(s) by key(s) from the cache.
     * @param key - The key or array of keys to retrieve from the cache.
     * @returns A Promise resolving to the cached item(s) or undefined.
     */
    get(key: string | number): Promise<T | undefined>;
    get(keys: Array<string | number>): Promise<Array<T>>;
    /**
     * Sets item(s) in the cache with an optional TTL.
     * @param item - The key-value pair or array of key-value pairs to set in the cache.
     * @param ttl - Optional time-to-live value for the cached item(s).
     * @returns A Promise indicating the success of the operation.
     */
    set(item: KeyValue<T>, ttl?: number): Promise<void>;
    set(items: Array<KeyValue<T>>, ttl?: number): Promise<void>;
    /**
     * Deletes item(s) from the cache by key(s).
     * @param keys - The key or array of keys to delete from the cache.
     * @returns A Promise indicating the success of the operation.
     */
    del(keys: Array<string | number>): Promise<void>;
    del(key: string | number): Promise<void>;
    /**
     * Clears all items from the cache.
     * @returns A Promise indicating the success of the operation.
     */
    clear(): Promise<void>;
}
