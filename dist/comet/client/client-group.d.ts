import type { Client } from "./client.ts";
export declare class ClientGroup {
    private clients;
    constructor(...clients: Array<Client>);
    get(version: number): Client | undefined;
    all(): Client[];
    range(from?: number, to?: number): Client[];
    pick(...versions: number[]): Client[];
    omit(...versions: number[]): Client[];
    filter(predicate: (client: Client) => boolean): Client[];
    last(): Client | undefined;
}
