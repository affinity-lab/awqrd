/**
 * Generates a function that cleans up image files based on the provided parameters.
 *
 * @param {string} name - the name to be used in the image file
 * @param {number} id - the id to be used in the image file
 * @param {string} file - the file extension to be used in the image file
 * @return {Promise<void>} a Promise that resolves when the image files are successfully deleted
 */
export declare function imgCleanupFactory(imgPath: string): (name: string, id: number, file: string) => Promise<void>;
