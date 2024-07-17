import fg from "fast-glob";
import path from "path";

/**
 * Loads default exports from modules in a specified directory.
 *
 * @template T - The type of the default export.
 * @param {string} dir - The directory containing the modules.
 * @returns {Array<T>} An array of default exports from the loaded modules.
 */
export async function loadModuleDefaultExports<T = any>(dir: string): Promise<Array<T>> {
	// Initialize an empty array to store the loaded modules
	const modules: Array<T> = [];

	// Get the list of files in the specified directory with .ts or .js extension
	const records = fg.globSync(path.join(dir + "/*.{ts,js}").replaceAll("\\", "/"));

	// Load each module asynchronously and push the default export into the 'modules' array
	await Promise.all(records.map(async (filename: string) => {
		if (typeof require !== "undefined") {
			let module: T = require(filename).default;
			modules.push(module);
		} else {
			let module: T = (await import(filename)).default;
			modules.push(module);
		}
	}));

	// Return the array of default exports
	return modules;
}


