/**
 * Recursively removes empty directories in the directory structure.
 * Starts from the specified directory and moves upwards,
 * removing empty directories until it encounters a non-empty directory.
 * @param {string} dir - The directory to start removing empty directories from.
 * @returns {Promise<void>} A Promise that resolves when the operation completes.
 */
export declare function removeEmptyParentDirectories(dir: string): Promise<void>;
