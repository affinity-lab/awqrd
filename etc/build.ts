import chalk from "chalk";
import {hashElement} from "folder-hash";
import fs from "fs";
import child_process from "node:child_process";
import path from "path";
import readline from 'readline';

// const readline = createInterface({input: process.stdin, output: process.stdout});
// process.on('exit', () => readline.close());
//"䷀ 𝌆 🗩 ⬅ ⮕⮑ ⬤ ⭘ ➜                                                                                                                               "

async function header(text: string) {
	await writeLn()
	await writeLn(
		chalk.grey("") +
		chalk.bgGrey.whiteBright(" " + text + " ") +
		chalk.gray("")
	)
	await writeLn()
}
async function write(text: string) {
	return new Promise((resolve) => {
		process.stdout.write(text, resolve)
	});
}
async function writeLn(text: string = "") { return write(text + "\n");}

async function clearLn() {
	return Promise.all([
		new Promise((resolve) => readline.cursorTo(process.stdout, 0, undefined, resolve as (() => void))),
		new Promise((resolve) => readline.clearLine(process.stdout, 0, resolve as (() => void)))
	])
}

function cmd(command: string): Promise<string> {
	return new Promise((resolve, reject) => {
		child_process.exec(command, (error, stdout) => {
			let res = stdout.toString().trim();
			if (error) reject(res);
			else resolve(res);
		});
	});
}


class PackageHandler {
	private readonly root: string;
	private packages: Record<string, Package> = {};

	constructor() {
		this.root = process.cwd();
	}

	async load() {
		await write("Loading packages... ");
		let workspaces = JSON.parse(fs.readFileSync("package.json").toString())["workspaces"];
		for (const workspace of workspaces) {
			let pkg = new Package(this.root, workspace);
			this.packages[pkg.name] = pkg;
		}
		await writeLn(chalk.green("done"))

		await write("Analyzing dependencies... ");
		let packageNames = Object.keys(this.packages);
		for (const name in this.packages) {
			let pkg = this.packages[name];
			pkg.dependencies = pkg.dependencies.filter((dep: string) => packageNames.includes(dep));
		}
		await writeLn(chalk.green("done"))

		await write("Calculating build order... ");
		let buildOrder: Set<string> = new Set();
		while (buildOrder.size < packageNames.length) {
			for (const name in this.packages) {
				let pkg = this.packages[name];
				let dependencies = pkg.dependencies.filter((dep: string) => !buildOrder.has(dep));
				if (dependencies.length === 0) {buildOrder.add(pkg.name);}
			}
		}

		let packages: Record<string, Package> = {};
		for (const name of buildOrder) packages[name] = this.packages[name];
		this.packages = packages;
		await writeLn(chalk.green("done"))

		await header(" Analyzing packages ")
		for (const name in this.packages) {
			let pkg = this.packages[name];
			await pkg.load();
			if (pkg.action.updateDepVersions || pkg.action.build) {
				for (const name2 in this.packages) {
					if (this.packages[name2].dependencies.includes(pkg.name)) {
						this.packages[name2].action.updateDepVersions = true;
					}
				}
			}
		}
	}

	async build() {
		await header("Building packages")
		for (const name in this.packages) {
			let pkg = this.packages[name]
			pkg.action.build && await pkg.build();
		}

		await header("Updating package versions")
		for (const name in this.packages) {
			let pkg = this.packages[name]
			if (pkg.action.updateDepVersions || pkg.action.build) {
				await write(pkg.title + " ")
				await write(chalk.green(pkg.version) + " ➜ ")
				pkg.bumpVersion();
				await writeLn(chalk.greenBright(pkg.version))
				for (const dep of pkg.dependencies) {
					let depPkg = this.packages[dep];
					if (depPkg.version !== pkg.pkg.dependencies[dep]) {
						await writeLn(
							chalk.gray(" ⮑  " + depPkg.title + " " + pkg.pkg.dependencies[dep] + " ➜ ") +
							chalk.magenta(depPkg.version)
						)
						pkg.pkg.dependencies[dep] = depPkg.version;
					}
				}
				await pkg.writeOutPackageJson();
				await pkg.generateHash();
			}
		}
	}
	async publish() {
		await header("Publishing packages");
		for (const name in this.packages) {
			let pkg = this.packages[name];
			await pkg.publish()
		}
	}
	async rehash() {
		for (const name in this.packages) {
			let pkg = this.packages[name];
			await pkg.generateHash();
		}
	}
}

class Package {
	name: string = "";
	version: string = "";
	dependencies: string[] = [];
	npmVersion: string = "";
	path: string;
	action: {
		build: boolean,
		updateDepVersions: boolean
	} = {build: false, updateDepVersions: false};
	pkg: Record<string, any>;
	title: string;


	constructor(root: string, public workspace: string) {
		this.path = path.join(root, workspace);
		this.pkg = JSON.parse(fs.readFileSync(path.join(this.path, "package.json")).toString());
		this.name = this.pkg.name;
		this.title = this.name.split("/").pop()!;
		this.version = this.pkg.version;
		this.dependencies = Object.keys(this.pkg.dependencies);
	}

	async load() {
		await write(`Loading package ${this.name}`);

		let prev_hash = fs.existsSync(path.join(this.path, ".hash")) ? fs.readFileSync(path.join(this.path, ".hash")).toString() : "0";
		let curr_hash = await hashElement(path.join(this.path), {files: {exclude: [".hash"]}});
		this.action.build = prev_hash !== curr_hash.hash;

		await clearLn()
		if (this.action.build || this.action.updateDepVersions) {
			await write(chalk.whiteBright(this.title) + " ");
			if (this.action.build) await write(chalk.bgGreenBright.bold.black(" BUILD ") + " ")
			if (this.action.updateDepVersions) await write(chalk.bold.bgBlue(" BUMP ") + " ")
			await write(chalk.gray("npm: "))
			this.npmVersion = await cmd(`npm view ${this.name} version`).catch(() => "0.0.0");
			if (this.version < this.npmVersion) {
				await writeLn()
				console.error(`ERROR: Version of ${this.name} (${this.version}) is lower than the one on npm (${this.npmVersion})`);
				process.exit(-1);
			}
			await write(chalk.green(this.npmVersion))
		} else {
			await write(chalk.white(this.title) + " ");
			await write(chalk.gray("ok"))
		}

		await writeLn()
	}

	async build() {
		await write(`${this.title}... `)
		process.chdir(this.path);

		await cmd("bun run build")
			.catch(async (error) => {
				await writeLn(chalk.red("failed"))
				console.error(`Error building ${this.name}`)
				console.log(error);
				process.exit(-1)
			});
		await writeLn(chalk.green("done"));
	}

	bumpVersion() {
		let ver = this.version.split('.');
		let patch = parseInt(ver.pop()!) + 1;
		this.version = [...ver, patch].join('.');
		this.pkg.version = this.version;
	}

	async writeOutPackageJson() {
		await fs.promises.writeFile(path.join(this.path, "package.json"), JSON.stringify(this.pkg, null, 2));
	}

	async generateHash() {
		let hash = await hashElement(path.join(this.path), {files: {exclude: [".hash"]}});
		await fs.promises.writeFile(path.join(this.path, ".hash"), hash.hash);
	}

	async publish() {
		process.chdir(this.path);
		if (this.npmVersion === "") this.npmVersion = await cmd(`npm view ${this.name} version`).catch(() => "0.0.1");

		if (this.version > this.npmVersion) {
			await write(chalk.whiteBright(this.title) + " ");
			await writeLn(chalk.green("PUBLISH"));
			try {
				let res = await cmd(`npm publish --access public`)
				console.log(res)
				await this.generateHash();
			} catch (e) {
				console.error("ERROR", e)
				process.exit(-1)
			}
		} else {
			await write(chalk.white(this.title) + " ");
			await writeLn(chalk.yellow("SKIP"));
		}
	}
}


let pkgHandler = new PackageHandler();
await pkgHandler.load();
if (process.argv.includes("rehash")) await pkgHandler.rehash();
if (process.argv.includes("build")) await pkgHandler.build();
if (process.argv.includes("pub")) await pkgHandler.publish();

process.exit(0);