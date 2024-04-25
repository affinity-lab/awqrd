import { Cache } from "./cache/cache.ts";
/**
 * Factory function to create a method decorator that caches the result of the method
 * @param {Cache} cacheService - The cache service to use for storing and retrieving cached values
 * @returns {MethodDecorator} - The method decorator function
 */
export declare function methodCacheFactory(cacheService: Cache): (ttl: number) => MethodDecorator;
