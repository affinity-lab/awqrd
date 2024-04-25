import type { Middleware } from "@affinity-lab/awqrd-util/pipeline.ts";
import type { CometState } from "../client/client.ts";
export declare class PreprocessMiddleware implements Middleware {
    handle(state: CometState, next: Function): Promise<any>;
}
