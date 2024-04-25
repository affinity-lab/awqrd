type ErrorData = {
    message?: string;
    details?: Record<string, any>;
    httpResponseCode: number;
    silent: boolean;
};
/**
 * Represents an extended error with additional properties such as error code, details, HTTP response code, and whether it should be silent.
 */
export declare class ExtendedError extends Error {
    readonly message: string;
    readonly code: string;
    readonly details?: Record<string, any> | undefined;
    readonly httpResponseCode: number;
    readonly silent: boolean;
    /**
     * Creates an instance of ExtendedError.
     *
     * @param {string} message - The error message.
     * @param {string} code - The error code.
     * @param {Record<string, any>} [details] - Additional details about the error.
     * @param {number} [httpResponseCode=500] - The HTTP response code associated with the error.
     * @param {boolean} [silent=false] - Whether the error should be silent (i.e., not logged or reported).
     */
    constructor(message: string, code: string, details?: Record<string, any> | undefined, httpResponseCode?: number, silent?: boolean);
}
/**
 * Preprocesses an error tree, converting all functions within the tree into error-generating functions
 * that create instances of ExtendedError with predefined error codes based on their names and positions in the tree.
 *
 * @param {Record<string, any>} errors - The error tree to preprocess.
 * @param {string} [prefix=""] - An optional prefix to prepend to all error codes generated from function names.
 * @returns {void}
 */
export declare function preprocessErrorTree(errors: Record<string, any>, prefix?: string): void;
/**
 * Creates an error data object with optional properties including error message, details, HTTP response code, and whether the error should be silent.
 *
 * @param {string} [message] - The error message.
 * @param {Record<string, any>} [details] - Additional details about the error.
 * @param {number} [httpResponseCode=500] - The HTTP response code associated with the error.
 * @param {boolean} [silent=false] - Whether the error should be silent (i.e., not logged or reported).
 * @returns {ErrorData} An error data object containing the specified properties.
 */
export declare function createErrorData(message?: string, details?: Record<string, any>, httpResponseCode?: number, silent?: boolean): ErrorData;
export {};
