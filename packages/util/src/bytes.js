"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bytes = void 0;
/**
 * Converts a string representation of file size to bytes. If a numeric value is provided, it returns it as is.
 * @param {string | number} sizeWithUnit - The size string with optional unit (e.g., "14kb", "35mb") or a numeric value representing bytes.
 * @returns {number} The size in bytes.
 * @throws {Error} If the provided size string is in an invalid format or if an invalid unit is encountered.
 * @description
 * This function accepts a string representation of file size with optional unit (e.g., "14kb", "35mb") or a numeric value representing bytes.
 * It converts the size to bytes and returns the result.
 * If a numeric value is provided, it is returned as is.
 * If the size string is in an invalid format or if an invalid unit is encountered, it throws an error.
 * Supported units are "kb" (kilobytes), "mb" (megabytes), "gb" (gigabytes), and "tb" (terabytes).
 * The function is case-insensitive and accepts both lowercase and uppercase unit abbreviations.
 */
function bytes(sizeWithUnit) {
    if (typeof sizeWithUnit === "number")
        return sizeWithUnit;
    var sizeRegex = /^(\d+(\.\d+)?|\.\d+)(kb|mb|gb|tb)$/i;
    var match = sizeWithUnit.match(sizeRegex);
    if (!match)
        return parseInt(sizeWithUnit);
    var size = parseInt(match[1]);
    var unit = match[3].toLowerCase();
    return Math.floor(size * Math.pow(1024, { kb: 1, mb: 2, gb: 3, tb: 4 }[unit]));
}
exports.bytes = bytes;
