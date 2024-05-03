import type { Cache } from "@affinity-lab/util";
import type { Middleware } from "@affinity-lab/util";
import type { CometState } from "../client/client";
export declare class CacheMiddleware implements Middleware {
    private cache;
    private defaultTtl;
    private defaultKeyFn;
    constructor(cache: Cache, defaultTtl?: number, defaultKeyFn?: (state: CometState) => string | Record<string, any>);
    handle(state: CometState, next: Function): Promise<any>;
}
