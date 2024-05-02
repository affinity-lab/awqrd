import type { Middleware } from "@affinity-lab/awqrd-util";
import type { CometState } from "../client/client";
export declare class RenderMiddleware implements Middleware {
    private errorHandler?;
    constructor(errorHandler?: ((error: any) => void) | undefined);
    handle(state: CometState, next: Function): Promise<Response & import("hono/types").TypedResponse<{
        error: never;
    }>>;
}
