"use strict";
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
exports.keyMap = exports.firstOrUndefined = exports.omitFields = exports.pickFields = exports.omitFieldsIP = exports.pickFieldsIP = void 0;
/**
 * Filters the fields of an object based on a provided list of field names.
 * @param values - The object containing the fields to be filtered.
 * @param fields - An array of field names to include in the filtered result.
 * @returns An object containing only the fields specified in the 'fields' array.
 */
function pickFieldsIP(values) {
    var fields = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        fields[_i - 1] = arguments[_i];
    }
    Object.keys(values).forEach(function (key) { if (!fields.includes(key))
        delete values[key]; });
    return values;
}
exports.pickFieldsIP = pickFieldsIP;
/**
 * Omits specified fields from an object.
 * @param values - The object containing the fields to be omitted.
 * @param fields - An array of field names to be omitted from the object.
 * @returns An object containing all fields except those specified in the 'fields' array.
 */
function omitFieldsIP(values) {
    var fields = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        fields[_i - 1] = arguments[_i];
    }
    fields.forEach(function (key) { delete values[key]; });
    return values;
}
exports.omitFieldsIP = omitFieldsIP;
/**
 * Filters the fields of an object based on a provided list of field names and returns a new object.
 * @param values - The object containing the fields to be filtered.
 * @param fields - An array of field names to include in the filtered result.
 * @returns A new object containing only the fields specified in the 'fields' array.
 */
function pickFields(values) {
    var fields = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        fields[_i - 1] = arguments[_i];
    }
    var result = {};
    Object.keys(values).forEach(function (key) { if (fields.includes(key))
        result[key] = values[key]; });
    return result;
}
exports.pickFields = pickFields;
/**
 * Omits specified fields from an object and returns a new object.
 * @param values - The object containing the fields to be omitted.
 * @param fields - An array of field names to be omitted from the object.
 * @returns A new object containing all fields except those specified in the 'fields' array.
 */
function omitFields(values) {
    var fields = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        fields[_i - 1] = arguments[_i];
    }
    var result = __assign({}, values);
    fields.forEach(function (key) { delete result[key]; });
    return result;
}
exports.omitFields = omitFields;
/**
 * Retrieves the first element of an array or returns undefined if the array is blank.
 * @param array - The array from which to retrieve the first element.
 * @returns The first element of the array, or undefined if the array is blank.
 */
function firstOrUndefined(array) { return array.length === 0 ? undefined : array[0]; }
exports.firstOrUndefined = firstOrUndefined;
/**
 * Generates a map from an array of items using a specified key.
 * @template T - The type of items.
 * @param items - An array of items.
 * @param key - The key to use for mapping.
 * @returns A map where the keys are IDs and the values are items.
 */
function keyMap(items, key) {
    if (key === void 0) { key = "id"; }
    var res = {};
    items.forEach(function (item) { return res[item[key]] = item; });
    return res;
}
exports.keyMap = keyMap;
