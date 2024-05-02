"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createErrorData = exports.preprocessErrorTree = exports.ExtendedError = void 0;
const change_case_all_1 = require("change-case-all");
/**
 * Represents an extended error with additional properties such as error code, details, HTTP response code, and whether it should be silent.
 */
class ExtendedError extends Error {
    /**
     * Creates an instance of ExtendedError.
     *
     * @param {string} message - The error message.
     * @param {string} code - The error code.
     * @param {Record<string, any>} [details] - Additional details about the error.
     * @param {number} [httpResponseCode=500] - The HTTP response code associated with the error.
     * @param {boolean} [silent=false] - Whether the error should be silent (i.e., not logged or reported).
     */
    constructor(message, code, details, httpResponseCode = 500, silent = false) {
        // Calls the constructor of the base Error class with the provided message.
        super(message);
        this.message = message;
        this.code = code;
        this.details = details;
        this.httpResponseCode = httpResponseCode;
        this.silent = silent;
        // Additional properties specific to ExtendedError.
        this.name = 'ExtendedError'; // Name of the error type.
        this.httpResponseCode = httpResponseCode;
        this.silent = silent;
        // An optional property providing additional information about the error cause.
        // This is added to the Error object as 'cause' for potential further analysis.
        this.cause = { code };
    }
}
exports.ExtendedError = ExtendedError;
/**
 * Preprocesses an error tree, converting all functions within the tree into error-generating functions
 * that create instances of ExtendedError with predefined error codes based on their names and positions in the tree.
 *
 * @param {Record<string, any>} errors - The error tree to preprocess.
 * @param {string} [prefix=""] - An optional prefix to prepend to all error codes generated from function names.
 * @returns {void}
 */
function preprocessErrorTree(errors, prefix = "") {
    for (const prop of Object.getOwnPropertyNames(errors)) {
        if (typeof errors[prop] === "object") {
            preprocessErrorTree(errors[prop], prefix + "_" + prop);
        }
        else if (typeof errors[prop] === "function") {
            const originalMethod = errors[prop];
            const code = (0, change_case_all_1.snakeCase)(prefix + "_" + prop).toUpperCase();
            errors[prop] = (...args) => {
                const errorData = Object.assign({ code }, originalMethod(...args));
                if (errorData.message === undefined)
                    errorData.message = code;
                return new ExtendedError(errorData.message, code, errorData.details, errorData.httpResponseCode, errorData.silent);
            };
        }
    }
}
exports.preprocessErrorTree = preprocessErrorTree;
/**
 * Creates an error data object with optional properties including error message, details, HTTP response code, and whether the error should be silent.
 *
 * @param {string} [message] - The error message.
 * @param {Record<string, any>} [details] - Additional details about the error.
 * @param {number} [httpResponseCode=500] - The HTTP response code associated with the error.
 * @param {boolean} [silent=false] - Whether the error should be silent (i.e., not logged or reported).
 * @returns {ErrorData} An error data object containing the specified properties.
 */
function createErrorData(message, details, httpResponseCode = 500, silent = false) {
    const error = { httpResponseCode, silent, details: undefined, message: undefined };
    if (typeof details !== "undefined")
        error.details = details;
    if (typeof message !== "undefined")
        error.message = message;
    return error;
}
exports.createErrorData = createErrorData;
