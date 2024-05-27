"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBG = void 0;
var chalk_1 = require("chalk");
var process_1 = require("process");
var sql_highlight_1 = require("sql-highlight");
var DBG = /** @class */ (function () {
    function DBG(config) {
        this.config = config;
    }
    DBG.prototype.req = function (p) {
        if (!this.config.console.req)
            return;
        p = p.trim();
        if (p.startsWith("<-- ")) {
            var a = p.substring(4).split(" ");
            console.log(chalk_1.default.magenta.bold("[") +
                chalk_1.default.bold.magenta("REQ:") +
                chalk_1.default.magenta(a[0]) +
                chalk_1.default.magenta.bold("]") +
                " " +
                chalk_1.default.whiteBright(a[1]));
        }
        else {
            var a = p.substring(4).split(" ");
            console.log(chalk_1.default.magenta.bold("[") +
                chalk_1.default.bold.magenta(a[2]) +
                chalk_1.default.magenta(":" + a[0]) +
                chalk_1.default.magenta.bold("]") +
                " " +
                chalk_1.default.whiteBright(a[1]) +
                " " +
                chalk_1.default.bold.greenBright(parseInt(a[3])) +
                chalk_1.default.white("ms"));
        }
        console.log();
    };
    DBG.prototype.logQuery = function (query, args) {
        if (!this.config.console.sql)
            return;
        console.log(chalk_1.default.bold.bgBlack.yellow("[SQL]"), (0, sql_highlight_1.highlight)(query));
        if (args.length > 0) {
            console.log(chalk_1.default.bgBlack.bold.yellow(":"), args);
        }
        console.log();
    };
    DBG.prototype.msg = function (message) {
        var formatted;
        var raw;
        if (typeof message === "string") {
            formatted = chalk_1.default.bgBlack.greenBright.bold(message);
            raw = message;
        }
        else {
            formatted = message;
            raw = message.toString();
        }
        var lines = raw.split("\n");
        var width = Math.max.apply(Math, lines.map(function (l) { return l.length; }));
        var top = "╭" + ("─".repeat(width + 2)) + "╮";
        var bottom = "╰" + ("─".repeat(width + 2)) + "╯";
        console.log(chalk_1.default.bgBlack.white(top));
        var flines = formatted.split("\n");
        for (var i = 0; i < lines.length; i++)
            console.log((i === 0 ? "╮ " : "│ ") + flines[i] + " ".repeat(width - lines[i].length) + " │");
        console.log(chalk_1.default.bgBlack.white(bottom));
    };
    DBG.prototype.log = function () {
        var messages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            messages[_i] = arguments[_i];
        }
        if (!this.config.console.dbg)
            return;
        var from = (new Error()).stack.substring(6).split("    at ")[2].replace(process_1.default.cwd(), "");
        var parts = /(.*?) \((.*?):(.*?):.*?\)/.exec(from);
        console.log(chalk_1.default.bold.bgBlack.blue("[DBG] ") +
            chalk_1.default.bold.cyan(parts[2]) +
            chalk_1.default.blue("(" + parts[3] + ") ") +
            chalk_1.default.bold.cyan(parts[1]));
        for (var idx = 0; idx < messages.length; idx++) {
            console.log(chalk_1.default.bold.bgBlack.blue(":"), messages[idx]);
        }
        console.log();
    };
    DBG.prototype.hello = function () {
        var lines = [
            "  ████   █       █   █████   █████   █████   ",
            " █    █  █       █  █     █  █    █  █    █  ",
            " ██████  █   █   █  █  █  █  █████   █     █ ",
            " █    █   █ █ █ █   █   █ █  █    █  █    █  ",
            " █    █    █   █     ███ █   █    █  █████   "
        ];
        for (var i = 0; i < lines.length; i++)
            lines[i] = "····· " + lines[i] + ' ·····';
        console.log();
        console.log(chalk_1.default.bold.bgBlack.magenta(lines[0].padEnd(0, "·")));
        console.log(chalk_1.default.bold.bgBlack.blue(lines[1].padEnd(0, "·")));
        console.log(chalk_1.default.bold.bgBlack.green(lines[2].padEnd(0, "·")));
        console.log(chalk_1.default.bold.bgBlack.yellow(lines[3].padEnd(0, "·")));
        console.log(chalk_1.default.bold.bgBlack.red(lines[4].padEnd(0, "·")));
        console.log();
    };
    return DBG;
}());
exports.DBG = DBG;
