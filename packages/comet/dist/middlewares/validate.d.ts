import type { Middleware } from "@affinity-lab/awqrd-util";
import type { CometState } from "../client/client";
export declare class ValidateMiddleware implements Middleware {
    handle(state: CometState, next: Function): Promise<any>;
}