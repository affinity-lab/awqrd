import fs from "fs";


export async function fileExists(path: string): Promise<boolean> {
	try {
		await fs.promises.access(path);
		return true;
	} catch (error) {
		// If access throws an error, the file or directory does not exist
		return false;
	}
}