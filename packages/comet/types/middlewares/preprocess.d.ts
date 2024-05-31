import type { Middleware } from "@affinity-lab/util";
import { CometState } from "../client/comet-state";
export declare class PreprocessMiddleware implements Middleware {
    handle(state: CometState, next: Function): Promise<any>;
}
