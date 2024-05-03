import * as child_process from "node:child_process";
import {packages} from "./build.ts";

function buildPackage(name: keyof typeof packages) {
	let pkg = packages[name];
	process.chdir(pkg.path)
	try {
		child_process.execSync("npm publish --access public").toString();
	} catch (e) {
		console.log("⏵ Error occurred...")
		process.exit(-1)
	}
}