export declare const entityError: {
    itemNotFound: (repository: string, id: number | undefined | null) => {
        message?: string | undefined;
        details?: Record<string, any> | undefined;
        httpResponseCode: number;
        silent: boolean;
    };
};
export declare function debugLog(s: string | any, lines?: boolean): void;
