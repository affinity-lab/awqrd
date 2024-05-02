import { Hono } from "hono";
export declare function filePathFromUrl(path: string): string;
export declare function stormStorageServerHono(app: Hono, path: string, prefix: string): void;
