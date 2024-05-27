import { EntityRepositoryInterface } from "@affinity-lab/storm";
import { ResultCacheWithMaps } from "./result-cache-factory";
/**
 * Returns a function that will get an item by a field name and cache the result.
 * @param repo
 * @param fieldName
 * @param resultCache
 * @param mapCache
 */
export declare function cachedGetByFactory<T extends string | number, R>(repo: EntityRepositoryInterface, fieldName: string, resultCache: ResultCacheWithMaps): (search: T) => Promise<R | undefined>;
