import type { Context } from "hono";
import { type Middleware, type MiddlewareFn } from "@affinity-lab/util";
type Command<Instance extends Object, MethodName extends keyof Instance> = {
    instance: Instance;
    key: MethodName;
    config: Record<string, any>;
    name: string;
    params: string[];
};
export type CometState = {
    args: Record<string, any>;
    env: Record<string, any>;
    files: Record<string, Array<File>>;
    id: string;
    ctx: Context;
    cmd: Command<any, any>;
    client: Client;
};
export declare abstract class Client {
    #private;
    readonly version: number;
    readonly id: string;
    private pipeline;
    constructor(version: number, middlewares?: Array<MiddlewareFn | Middleware>);
    authApi(apiKey: string | undefined): boolean;
    protected execute(state: CometState): Promise<any>;
    resolve(command: string, ctx: Context): Promise<any>;
    add(name: string, instance: any, key: string, config: Record<string, any>, params: string[]): void;
}
export {};
