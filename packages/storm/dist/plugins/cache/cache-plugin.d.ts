import { EntityRepository } from "../../entity-repository";
import type { Cache } from "@affinity-lab/awqrd-util/";
import { type ResultCacheFn } from "./result-cache-factory";
export declare function cachePlugin(repository: EntityRepository<any, any, any>, cache: Cache, resultCache?: ResultCacheFn): void;
