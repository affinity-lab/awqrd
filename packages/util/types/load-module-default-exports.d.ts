/**
 * Loads default exports from modules in a specified directory.
 *
 * @template T - The type of the default export.
 * @param {string} dir - The directory containing the modules.
 * @returns {Array<T>} An array of default exports from the loaded modules.
 */
export declare function loadModuleDefaultExports<T = any>(dir: string): Array<T>;
