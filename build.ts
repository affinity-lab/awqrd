import fs from "fs";
import * as child_process from "node:child_process";
import path from "path";

const root = process.cwd();


let packages = {
	util: {
		version: "0.0.1",
		path: path.join(root, "packages/util"),
		name: "",
		dependencies: []
	},
	storm: {
		version: "0.0.1",
		path: path.join(root, "packages/storm"),
		name: "",
		dependencies: ["util"]
	},
	comet: {
		version: "0.0.1",
		path: path.join(root, "packages/comet"),
		name: "",
		dependencies: ["util"]
	},
	schemaHelper: {
		version: "0.0.1",
		path: path.join(root, "packages/schema-helper"),
		name: "",
		dependencies: []
	}
}


buildPackage("util")
buildPackage("comet")
buildPackage("storm")
buildPackage("schemaHelper")


function buildPackage(name: keyof typeof packages) {

	let pkg = packages[name];

	console.log(`\n${name}`)
	process.chdir(pkg.path)

	pkg.name = fetchName();
	pkg.version = fetchVersion();
	console.log("⏵ Current package version: ", pkg.version);

	console.log("⏵ Run build script")
	try {
		child_process.execSync("bun run build").toString();
	} catch (e) {
		console.log("⏵ Error occurred...")
		process.exit(-1)
	}

	pkg.version = bumpVersion(pkg.version);
	console.log("⏵ New package version: ", pkg.version);
	updateVersion(pkg.version);

	for (const dependency of pkg.dependencies) {
		let name = packages[dependency as keyof typeof packages].name;
		let version = packages[dependency as keyof typeof packages].version;
		console.log(`⏵ Updating dependecy ${name} to version: ${version}`);
		updateDependency(name, version)
	}

	console.log("Publishing package to npm")
	try {
		child_process.execSync("npm publish --access public").toString();
	} catch (e) {
		console.log("⏵ Error occurred...")
		process.exit(-1)
	}
	console.log("⏵ Done.")
}


function updateDependency(dependency: string, version: string) {
	let content = JSON.parse(fs.readFileSync("package.json").toString());
	content.dependencies[dependency] = version;
	fs.writeFileSync("package.json", JSON.stringify(content, null, 2));
}

function fetchVersion() {
	let content = JSON.parse(fs.readFileSync("package.json").toString());
	return content.version;
}
function fetchName() {
	let content = JSON.parse(fs.readFileSync("package.json").toString());
	return content.name;
}

function bumpVersion(version: string) {
	let ver = version.split('.');
	let patch = parseInt(ver.pop()!) + 1;
	return [...ver, patch].join('.')
}

function updateVersion(version: string) {
	let content = JSON.parse(fs.readFileSync("package.json").toString());
	content.version = version;
	fs.writeFileSync("package.json", JSON.stringify(content, null, 2));
}