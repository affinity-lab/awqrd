import chalk from "chalk";
import process from "process";
import {highlight} from "sql-highlight";

export class DBG {
	constructor(config:
		{
			console: {
				dbg: boolean,
				sql: boolean,
				req: boolean,
			},
			file: {
				dbg: string|undefined,
				sql: string|undefined,
				req: string|undefined,
			}
		}) {}

	req(p: string) {
		p = p.trim()
		if (p.startsWith("<-- ")) {
			let a = p.substring(4).split(" ");
			console.log(
				chalk.magenta.bold(`[`) +
				chalk.bold.magenta(`REQ:`) +
				chalk.magenta(a[0]) +
				chalk.magenta.bold(`]`) +
				" " +
				chalk.whiteBright(a[1])
			)
		} else {
			let a = p.substring(4).split(" ");
			console.log(
				chalk.magenta.bold(`[`) +
				chalk.bold.magenta(a[2]) +
				chalk.magenta(":" + a[0]) +
				chalk.magenta.bold(`]`) +

				" " +
				chalk.whiteBright(a[1]) +
				" " +
				chalk.bold.greenBright(parseInt(a[3])) +
				chalk.white("ms")
			)
		}
		console.log()
	}

	logQuery(query: string, args: any[]) {
		console.log(chalk.bold.bgBlack.yellow(`[SQL]`), highlight(query))
		if (args.length > 0) {
			console.log(chalk.bgBlack.bold.yellow(`:`), args)
		}
		console.log()
	}

	log(...messages: any[]) {
		let from = (new Error()).stack!.substring(6).split("    at ")[2].replace(process.cwd(), "");
		let parts = /(.*?) \((.*?):(.*?):.*?\)/.exec(from)

		console.log(
			chalk.bold.bgBlack.blue(`[DBG] `) +
			chalk.bold.cyan(parts![2]) +
			chalk.blue("(" + parts![3] + ") ") +
			chalk.bold.cyan(parts![1])
		);
		for (let idx = 0; idx < messages.length; idx++) {
			console.log(chalk.bold.bgBlack.blue(`:`), messages[idx]);
		}
		console.log()
	}

	hello() {
		let width = process.stdout.columns;

		let lines = [
			"  ████   █       █   █████   █████   █████   ",
			" █    █  █       █  █     █  █    █  █    █  ",
			" ██████  █   █   █  █  █  █  █████   █     █ ",
			" █    █   █ █ █ █   █   █ █  █    █  █    █  ",
			" █    █    █   █     ███ █   █    █  █████   "
		];
		for (let i = 0; i < lines.length; i++) lines[i] = "····· " + lines[i] + ' ·····';

		console.log()
		console.log(chalk.bold.bgBlack.magenta(lines[0].padEnd(0, "·")))
		console.log(chalk.bold.bgBlack.blue(lines[1].padEnd(0, "·")))
		console.log(chalk.bold.bgBlack.green(lines[2].padEnd(0, "·")))
		console.log(chalk.bold.bgBlack.yellow(lines[3].padEnd(0, "·")))
		console.log(chalk.bold.bgBlack.red(lines[4].padEnd(0, "·")))
		console.log()
	}
}