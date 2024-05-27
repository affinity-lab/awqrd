"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createErrorData = exports.preprocessErrorTree = exports.ExtendedError = void 0;
var change_case_all_1 = require("change-case-all");
/**
 * Represents an extended error with additional properties such as error code, details, HTTP response code, and whether it should be silent.
 */
var ExtendedError = /** @class */ (function (_super) {
    __extends(ExtendedError, _super);
    /**
     * Creates an instance of ExtendedError.
     *
     * @param {string} message - The error message.
     * @param {string} code - The error code.
     * @param {Record<string, any>} [details] - Additional details about the error.
     * @param {number} [httpResponseCode=500] - The HTTP response code associated with the error.
     * @param {boolean} [silent=false] - Whether the error should be silent (i.e., not logged or reported).
     */
    function ExtendedError(message, code, details, httpResponseCode, silent) {
        if (httpResponseCode === void 0) { httpResponseCode = 500; }
        if (silent === void 0) { silent = false; }
        // Calls the constructor of the base Error class with the provided message.
        var _this = _super.call(this, message) || this;
        _this.message = message;
        _this.code = code;
        _this.details = details;
        _this.httpResponseCode = httpResponseCode;
        _this.silent = silent;
        // Additional properties specific to ExtendedError.
        _this.name = 'ExtendedError'; // Name of the error type.
        _this.httpResponseCode = httpResponseCode;
        _this.silent = silent;
        // An optional property providing additional information about the error cause.
        // This is added to the Error object as 'cause' for potential further analysis.
        _this.cause = { code: code };
        return _this;
    }
    return ExtendedError;
}(Error));
exports.ExtendedError = ExtendedError;
/**
 * Preprocesses an error tree, converting all functions within the tree into error-generating functions
 * that create instances of ExtendedError with predefined error codes based on their names and positions in the tree.
 *
 * @param {Record<string, any>} errors - The error tree to preprocess.
 * @param {string} [prefix=""] - An optional prefix to prepend to all error codes generated from function names.
 * @returns {void}
 */
function preprocessErrorTree(errors, prefix) {
    if (prefix === void 0) { prefix = ""; }
    var _loop_1 = function (prop) {
        if (typeof errors[prop] === "object") {
            preprocessErrorTree(errors[prop], prefix + "_" + prop);
        }
        else if (typeof errors[prop] === "function") {
            var originalMethod_1 = errors[prop];
            var code_1 = (0, change_case_all_1.snakeCase)(prefix + "_" + prop).toUpperCase();
            errors[prop] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var errorData = __assign({ code: code_1 }, originalMethod_1.apply(void 0, args));
                if (errorData.message === undefined)
                    errorData.message = code_1;
                return new ExtendedError(errorData.message, code_1, errorData.details, errorData.httpResponseCode, errorData.silent);
            };
        }
    };
    for (var _i = 0, _a = Object.getOwnPropertyNames(errors); _i < _a.length; _i++) {
        var prop = _a[_i];
        _loop_1(prop);
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
function createErrorData(message, details, httpResponseCode, silent) {
    if (httpResponseCode === void 0) { httpResponseCode = 500; }
    if (silent === void 0) { silent = false; }
    var error = { httpResponseCode: httpResponseCode, silent: silent, details: undefined, message: undefined };
    if (typeof details !== "undefined")
        error.details = details;
    if (typeof message !== "undefined")
        error.message = message;
    return error;
}
exports.createErrorData = createErrorData;
