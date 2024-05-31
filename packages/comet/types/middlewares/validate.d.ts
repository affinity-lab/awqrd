import type { Middleware } from "@affinity-lab/util";
import { CometState } from "../client/comet-state";
export declare class ValidateMiddleware implements Middleware {
    handle(state: CometState, next: Function): Promise<any>;
}
