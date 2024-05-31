import type { Middleware } from "@affinity-lab/util";
import { ExtendedError } from "@affinity-lab/util";
import { CometState } from "../client/comet-state";
export type Result = {
    result: any;
    status: number;
};
export declare class RenderMiddleware implements Middleware {
    private readonly errorHandlers;
    constructor(...errorHandlers: Array<(error: any) => ExtendedError | undefined>);
    handle(state: CometState, next: Function): Promise<Result>;
}
