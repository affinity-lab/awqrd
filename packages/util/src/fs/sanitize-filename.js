"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeFilename = void 0;
/**
 * Sanitizes a filename or URL by removing accents, replacing non-filename characters with hyphens,
 * removing leading/trailing hyphens and dots, and replacing specific sequences of characters with dots.
 *
 * @param {string} filename The filename or URL to sanitize.
 * @returns {string} The sanitized filename or URL.
 */
function sanitizeFilename(filename) {
    filename = filename.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    filename = filename.replace(/[^a-zA-Z0-9_.]/g, '-');
    filename = filename.replace(/(^[-.]+)|([-._]+)$/g, '');
    filename = filename.replace(/-+/g, '-');
    filename = filename.replace(/\.[-]/g, '.');
    filename = filename.replace(/[-.]\./g, '.');
    return filename;
}
exports.sanitizeFilename = sanitizeFilename;
