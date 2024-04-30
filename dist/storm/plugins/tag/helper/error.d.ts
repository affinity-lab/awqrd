export declare const tagError: {
    itemNotFound: (repository: string) => {
        message?: string | undefined;
        details?: Record<string, any> | undefined;
        httpResponseCode: number;
        silent: boolean;
    };
    groupId: () => {
        message?: string | undefined;
        details?: Record<string, any> | undefined;
        httpResponseCode: number;
        silent: boolean;
    };
};
