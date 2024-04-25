/**
 * Generates a unique filename by appending a numerical suffix to the filename if it already exists in the specified directory.
 *
 * @param {string} directory - The directory path where the filename should be unique.
 * @param {string} filename - The original filename.
 * @returns {Promise<string>} A Promise that resolves to a unique filename that does not exist in the specified directory.
 */
export declare function getUniqueFilename(directory: string, filename: string): Promise<string>;
