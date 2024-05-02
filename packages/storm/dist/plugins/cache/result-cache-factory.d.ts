import type { Cache } from "@affinity-lab/awqrd-util/";
export type ResultCacheFn = (res: (Record<string, any> | Array<Record<string, any>>)) => Promise<Record<string, any> | Array<Record<string, any>>>;
export declare function resultCacheFactory(cache: Cache, mapCache?: Cache, ...fields: string[]): ResultCacheFn;
