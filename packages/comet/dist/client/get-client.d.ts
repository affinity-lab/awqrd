import type { ClientGroup } from "./client-group";
export declare function getClient(clients: Record<string, ClientGroup>, name: string, version: number, apiKey: string | undefined): import("./client").Client;
