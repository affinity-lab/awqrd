/// <reference types="node" />
import type { Middleware } from "@affinity-lab/util";
import { ExtendedError } from "@affinity-lab/util";
import { StatusCode } from "hono/utils/http-status";
import type { CometState } from "../client/client";
export declare class RenderMiddleware implements Middleware {
    private readonly errorHandlers;
    constructor(...errorHandlers: Array<(error: any) => ExtendedError | undefined>);
    handle(state: CometState, next: Function): Promise<Response & import("hono").TypedResponse<any, StatusCode, "json">>;
}
