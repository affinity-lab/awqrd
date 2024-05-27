export declare const cometError: {
    client: {
        unsupported: () => {
            message?: string | undefined;
            details?: Record<string, any> | undefined;
            httpResponseCode: number;
            silent: boolean;
        };
        noInfo: () => {
            message?: string | undefined;
            details?: Record<string, any> | undefined;
            httpResponseCode: number;
            silent: boolean;
        };
        notFound: (name: string, version: number) => {
            message?: string | undefined;
            details?: Record<string, any> | undefined;
            httpResponseCode: number;
            silent: boolean;
        };
        notAuthorized: (name: string, version: number) => {
            message?: string | undefined;
            details?: Record<string, any> | undefined;
            httpResponseCode: number;
            silent: boolean;
        };
    };
    contentTypeNotAccepted: (contentType: string) => {
        message?: string | undefined;
        details?: Record<string, any> | undefined;
        httpResponseCode: number;
        silent: boolean;
    };
    validation: (issues: Record<string, any>) => {
        message?: string | undefined;
        details?: Record<string, any> | undefined;
        httpResponseCode: number;
        silent: boolean;
    };
    unauthorized: () => {
        message?: string | undefined;
        details?: Record<string, any> | undefined;
        httpResponseCode: number;
        silent: boolean;
    };
    forbidden: () => {
        message?: string | undefined;
        details?: Record<string, any> | undefined;
        httpResponseCode: number;
        silent: boolean;
    };
    conflict: (details?: Record<string, any>) => {
        message?: string | undefined;
        details?: Record<string, any> | undefined;
        httpResponseCode: number;
        silent: boolean;
    };
    notFound: (details?: Record<string, any>) => {
        message?: string | undefined;
        details?: Record<string, any> | undefined;
        httpResponseCode: number;
        silent: boolean;
    };
    error: (details?: Record<string, any>) => {
        message?: string | undefined;
        details?: Record<string, any> | undefined;
        httpResponseCode: number;
        silent: boolean;
    };
};
