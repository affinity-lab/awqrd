import type { Middleware } from "@affinity-lab/awqrd-util";
import type { CometState } from "../client/client";
export declare class FetchArgsMiddleware implements Middleware {
    handle(state: CometState, next: Function): Promise<any>;
}
