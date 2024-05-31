import { type Middleware, type MiddlewareFn } from "@affinity-lab/util";
import { CometState } from "./comet-state";
export declare abstract class Client<CTX = any> {
    #private;
    readonly version: number;
    readonly unsupported: boolean;
    readonly id: string;
    private pipeline;
    constructor(version: number, middlewares?: Array<MiddlewareFn | Middleware>, unsupported?: boolean);
    authApi(apiKey: string | undefined): Promise<boolean>;
    protected execute(state: CometState): Promise<any>;
    resolve(command: string, ctx: CTX): Promise<any>;
    add(name: string, instance: any, key: string, config: Record<string, any>, params: string[]): void;
}
