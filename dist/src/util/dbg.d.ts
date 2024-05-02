export declare class DBG {
    constructor(config: {
        console: {
            dbg: boolean;
            sql: boolean;
            req: boolean;
        };
        file: {
            dbg: string | undefined;
            sql: string | undefined;
            req: string | undefined;
        };
    });
    req(p: string): void;
    logQuery(query: string, args: any[]): void;
    log(...messages: any[]): void;
    hello(): void;
}
