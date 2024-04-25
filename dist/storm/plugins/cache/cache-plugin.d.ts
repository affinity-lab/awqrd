import { EntityRepository } from "../../entity-repository.ts";
import type { Cache } from "@affinity-lab/awqrd-util/cache/cache.ts";
import { type ResultCacheFn } from "./result-cache-factory.ts";
export declare function cachePlugin(repository: EntityRepository<any, any, any>, cache: Cache, resultCache?: ResultCacheFn): void;
