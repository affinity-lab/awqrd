import type { Middleware } from "@affinity-lab/awqrd-util/pipeline.ts";
import type { CometState } from "../client/client.ts";
export declare class RenderMiddleware implements Middleware {
    private errorHandler?;
    constructor(errorHandler?: ((error: any) => void) | undefined);
    handle(state: CometState, next: Function): Promise<Response & import("hono").TypedResponse<{
        error: never;
    }>>;
}
