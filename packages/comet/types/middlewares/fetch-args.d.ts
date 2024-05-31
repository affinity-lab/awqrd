import type { Middleware } from "@affinity-lab/util";
import { CometState } from "../client/comet-state";
export declare class FetchArgsMiddleware implements Middleware {
    protected argParser: (ctx: any) => Promise<{
        args: any;
        files: any;
        params: any;
    }>;
    constructor(argParser: (ctx: any) => Promise<{
        args: any;
        files: any;
        params: any;
    }>);
    handle(state: CometState, next: Function): Promise<any>;
}
