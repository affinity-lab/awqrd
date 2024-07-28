import fs from "fs";
import * as child_process from "node:child_process";
import path from "path";

const root = process.cwd();

class Package {
	name: string = "";
	version: string = "";
	path: string = "";
	dependencies: string[] = [];

	constructor(name:string,  ...dependencies: string[]) {
		this.name = name;
		this.path = path.join(root, 'packages', name);
		this.dependencies = dependencies;
	}
}

export let packages = {
	util: new Package("util"),
	storm: new Package("storm", "util"),
	stormCache: new Package("storm-cache", "storm", "util"),
	stormSequence: new Package("storm-sequence", "storm", "util"),
	stormStorage: new Package("storm-storage", "storm", "util"),
	stormStorageServerBunHono: new Package("storm-storage-server-bun-hono", "storm", "util", "stormStorage"),
	stormStorageServerSvelteKit: new Package("storm-storage-server-sveltekit", "storm", "util", "stormStorage"),
	stormTag: new Package("storm-tag", "storm", "util"),
	stormValidator: new Package("storm-validator", "storm", "util"),
	comet: new Package("comet", "util"),
	cometBunHono: new Package("comet-bun-hono", "comet"),
	cometSvelteKit: new Package("comet-sveltekit", "comet"),
	sapphire: new Package("sapphire", "comet", "util", "storm", "stormStorage"),
}

readPackages();

if (process.argv.includes("build")) oldBuild();

if (process.argv.includes("publish")){
	let pi = process.argv.findIndex(i=>i==="publish")
	publish(process.argv[pi+1]);
}


function oldBuild() {
	buildPackage("util")
	buildPackage("comet")
	buildPackage("storm")
	buildPackage("stormSequence")
	buildPackage("stormCache")
	buildPackage("stormStorage")
	buildPackage("stormStorageServerBunHono")
	buildPackage("stormTag")
	buildPackage("stormValidator")
	buildPackage("sapphire")
	buildPackage("cometBunHono")
	buildPackage("cometSvelteKit")
	buildPackage("stormStorageServerSvelteKit")
}


function publish(code:string) {
	publishPackage("util", code)
	publishPackage("comet", code)
	publishPackage("storm", code)
	publishPackage("stormSequence", code)
	publishPackage("stormCache", code)
	publishPackage("stormStorage", code)
	publishPackage("stormTag", code)
	publishPackage("stormValidator", code)
	publishPackage("stormStorageServerBunHono", code)
	publishPackage("sapphire", code)
	publishPackage("cometBunHono", code)
	publishPackage("cometSvelteKit", code)
	publishPackage("stormStorageServerSvelteKit", code)
}

function publishPackage(name: keyof typeof packages, code:string) {
	let pkg = packages[name];
	console.log(`Publishing package ${pkg.name}`);
	process.chdir(pkg.path)
	try {
		if(code) child_process.execSync(`npm publish --access public --otp=${code}`).toString();
		else child_process.execSync(`npm publish --access public`).toString();
	} catch (e) {
		console.log("⏵ Error occurred...")
		process.exit(-1)
	}
}

function readPackages(){
	for (const name in packages) {
		let pkg = packages[name as keyof typeof packages];
		process.chdir(pkg.path)
		pkg.name = fetchName();
		pkg.version = fetchVersion();
	}
}

function buildPackage(name: keyof typeof packages) {

	let pkg = packages[name];
	process.chdir(pkg.path)

	console.log(`\n${name}`)

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
		console.log(dependency)
		let name = packages[dependency as keyof typeof packages].name;
		let version = packages[dependency as keyof typeof packages].version;
		console.log(`⏵ Updating dependecy ${name} to version: ${version}`);
		updateDependency(name, version)
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