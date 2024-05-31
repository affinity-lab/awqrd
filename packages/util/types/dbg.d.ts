export declare class DBG {
    private config;
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
    msg(message: string | any): void;
    err(message: any, traceSkip?: number): void;
    log(...messages: any[]): void;
    hello(): void;
}
