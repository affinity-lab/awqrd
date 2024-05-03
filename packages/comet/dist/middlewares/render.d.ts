import type { Middleware } from "@affinity-lab/util";
import type { CometState } from "../client/client";
export declare class RenderMiddleware implements Middleware {
    private errorHandler?;
    constructor(errorHandler?: ((error: any) => void) | undefined);
    handle(state: CometState, next: Function): Promise<Response & import("hono").TypedResponse<any, import("hono/utils/http-status").StatusCode, "json">>;
}
