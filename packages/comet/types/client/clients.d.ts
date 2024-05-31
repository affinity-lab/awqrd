import { Client } from "./client";
import { ClientGroup } from "./client-group";
export declare abstract class Clients {
    readonly clients: Record<string, ClientGroup>;
    constructor(clients: Record<string, ClientGroup>);
    protected group(name: string): ClientGroup | undefined;
    protected find(name: string | undefined, version: number | string | undefined, apiKey: string | undefined): Promise<Client>;
    readCommands(commandsPath: string): void;
    abstract get(ctx: any): Promise<Client<any>>;
}
