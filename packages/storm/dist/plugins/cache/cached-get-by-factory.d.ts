import { EntityRepository } from "../../entity-repository";
import type { Cache } from "@affinity-lab/util/";
import { type ResultCacheFn } from "./result-cache-factory";
export declare function cachedGetByFactory<T extends string | number, R>(repo: EntityRepository<any, any, any>, fieldName: string, resultCache: ResultCacheFn, mapCache: Cache): (search: T) => Promise<R | undefined>;
