/**
 * Sanitizes a filename or URL by removing accents, replacing non-filename characters with hyphens,
 * removing leading/trailing hyphens and dots, and replacing specific sequences of characters with dots.
 *
 * @param {string} filename The filename or URL to sanitize.
 * @returns {string} The sanitized filename or URL.
 */
export declare function sanitizeFilename(filename: string): string;
