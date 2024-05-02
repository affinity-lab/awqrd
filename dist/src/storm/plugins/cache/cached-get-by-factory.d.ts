import { EntityRepository } from "../../entity-repository.ts";
import type { Cache } from "@affinity-lab/awqrd-util/cache/cache.ts";
import { type ResultCacheFn } from "./result-cache-factory.ts";
export declare function cachedGetByFactory<T extends string | number, R>(repo: EntityRepository<any, any, any>, fieldName: string, resultCache: ResultCacheFn, mapCache: Cache): (search: T) => Promise<R | undefined>;
