export declare const entityError: {
    itemNotFound: (repository: string, id: number | undefined | null) => {
        message?: string | undefined;
        details?: Record<string, any> | undefined;
        httpResponseCode: number;
        silent: boolean;
    };
};
