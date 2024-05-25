import chalk from "chalk";
import process from "process";
import {highlight} from "sql-highlight";

export class DBG {
	constructor(private config:
		{
			console: {
				dbg: boolean,
				sql: boolean,
				req: boolean,
			},
			file: {
				dbg: string | undefined,
				sql: string | undefined,
				req: string | undefined,
			}
		}) {}

	req(p: string) {
		if (!this.config.console.req) return;
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
		if (!this.config.console.sql) return;
		console.log(chalk.bold.bgBlack.yellow(`[SQL]`), highlight(query))
		if (args.length > 0) {
			console.log(chalk.bgBlack.bold.yellow(`:`), args)
		}
		console.log()
	}

	msg(message: string | any) {
		let formatted: any;
		let raw: string;
		if (typeof message === "string") {
			formatted = chalk.bgBlack.greenBright.bold(message);
			raw = message;
		} else {
			formatted = message;
			raw = message.toString();
		}

		let lines = raw.split("\n");
		let width = Math.max(...lines.map((l) => l.length));
		let top = "╭" + ("─".repeat(width + 2)) + "╮";
		let bottom = "╰" + ("─".repeat(width + 2)) + "╯";

		console.log(chalk.bgBlack.white(top))
		let flines = formatted.split("\n");
		for (let i = 0; i < lines.length; i++) console.log((i === 0 ? "╮ " : "│ ") + flines[i] + " ".repeat(width - lines[i].length) + " │")
		console.log(chalk.bgBlack.white(bottom))
	}

	err(message: any, traceSkip = 2) {
		if (!this.config.console.dbg) return;
		let from: string;
		if (message.stack)
			from = message.stack!.substring(6).split("    at ")[traceSkip].replace(process.cwd(), "");
		else
			from = (new Error()).stack!.substring(6).split("    at ")[traceSkip].replace(process.cwd(), "");

		let parts = /(.*?) \((.*?):(.*?):.*?\)/.exec(from)

		console.log(
			chalk.bold.bgBlack.blue(`[DBG] `) +
			chalk.bold.cyan(parts![2]) +
			chalk.blue("(" + parts![3] + ") ") +
			chalk.bold.cyan(parts![1])
		);
		console.log(chalk.bold.bgBlack.blue(`:`), message);
		console.log()
	}

	log(...messages: any[]) {
		if (!this.config.console.dbg) return;
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
