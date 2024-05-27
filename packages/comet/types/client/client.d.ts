/// <reference types="node" />
/// <reference types="bun-types" />
import { type Middleware, type MiddlewareFn } from "@affinity-lab/util";
import type { Context } from "hono";
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
    readonly unsupported: boolean;
    readonly id: string;
    private pipeline;
    constructor(version: number, middlewares?: Array<MiddlewareFn | Middleware>, unsupported?: boolean);
    authApi(apiKey: string | undefined): boolean;
    protected execute(state: CometState): Promise<any>;
    resolve(command: string, ctx: Context): Promise<any>;
    add(name: string, instance: any, key: string, config: Record<string, any>, params: string[]): void;
}
export {};
