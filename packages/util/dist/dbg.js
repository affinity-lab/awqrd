"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBG = void 0;
const chalk_1 = __importDefault(require("chalk"));
const process_1 = __importDefault(require("process"));
const sql_highlight_1 = require("sql-highlight");
class DBG {
    constructor(config) {
        this.config = config;
    }
    req(p) {
        if (!this.config.console.req)
            return;
        p = p.trim();
        if (p.startsWith("<-- ")) {
            let a = p.substring(4).split(" ");
            console.log(chalk_1.default.magenta.bold(`[`) +
                chalk_1.default.bold.magenta(`REQ:`) +
                chalk_1.default.magenta(a[0]) +
                chalk_1.default.magenta.bold(`]`) +
                " " +
                chalk_1.default.whiteBright(a[1]));
        }
        else {
            let a = p.substring(4).split(" ");
            console.log(chalk_1.default.magenta.bold(`[`) +
                chalk_1.default.bold.magenta(a[2]) +
                chalk_1.default.magenta(":" + a[0]) +
                chalk_1.default.magenta.bold(`]`) +
                " " +
                chalk_1.default.whiteBright(a[1]) +
                " " +
                chalk_1.default.bold.greenBright(parseInt(a[3])) +
                chalk_1.default.white("ms"));
        }
        console.log();
    }
    logQuery(query, args) {
        if (!this.config.console.sql)
            return;
        console.log(chalk_1.default.bold.bgBlack.yellow(`[SQL]`), (0, sql_highlight_1.highlight)(query));
        if (args.length > 0) {
            console.log(chalk_1.default.bgBlack.bold.yellow(`:`), args);
        }
        console.log();
    }
    log(...messages) {
        if (!this.config.console.dbg)
            return;
        let from = (new Error()).stack.substring(6).split("    at ")[2].replace(process_1.default.cwd(), "");
        let parts = /(.*?) \((.*?):(.*?):.*?\)/.exec(from);
        console.log(chalk_1.default.bold.bgBlack.blue(`[DBG] `) +
            chalk_1.default.bold.cyan(parts[2]) +
            chalk_1.default.blue("(" + parts[3] + ") ") +
            chalk_1.default.bold.cyan(parts[1]));
        for (let idx = 0; idx < messages.length; idx++) {
            console.log(chalk_1.default.bold.bgBlack.blue(`:`), messages[idx]);
        }
        console.log();
    }
    hello() {
        let lines = [
            "  ████   █       █   █████   █████   █████   ",
            " █    █  █       █  █     █  █    █  █    █  ",
            " ██████  █   █   █  █  █  █  █████   █     █ ",
            " █    █   █ █ █ █   █   █ █  █    █  █    █  ",
            " █    █    █   █     ███ █   █    █  █████   "
        ];
        for (let i = 0; i < lines.length; i++)
            lines[i] = "····· " + lines[i] + ' ·····';
        console.log();
        console.log(chalk_1.default.bold.bgBlack.magenta(lines[0].padEnd(0, "·")));
        console.log(chalk_1.default.bold.bgBlack.blue(lines[1].padEnd(0, "·")));
        console.log(chalk_1.default.bold.bgBlack.green(lines[2].padEnd(0, "·")));
        console.log(chalk_1.default.bold.bgBlack.yellow(lines[3].padEnd(0, "·")));
        console.log(chalk_1.default.bold.bgBlack.red(lines[4].padEnd(0, "·")));
        console.log();
    }
}
exports.DBG = DBG;
