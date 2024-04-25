import type { ClientGroup } from "./client-group.ts";
export declare function getClient(clients: Record<string, ClientGroup>, name: string, version: number, apiKey: string | undefined): import("@affinity-lab/awqrd/src/index.ts").Client;
