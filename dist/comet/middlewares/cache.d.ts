import type { Cache } from "@affinity-lab/awqrd-util/cache/cache.ts";
import type { Middleware } from "@affinity-lab/awqrd-util/pipeline.ts";
import type { CometState } from "../client/client.ts";
export declare class CacheMiddleware implements Middleware {
    private cache;
    private defaultTtl;
    private defaultKeyFn;
    constructor(cache: Cache, defaultTtl?: number, defaultKeyFn?: (state: CometState) => string | Record<string, any>);
    handle(state: CometState, next: Function): Promise<any>;
}
