"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Client_commands;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const awqrd_util_1 = require("@affinity-lab/awqrd-util");
class Client {
    constructor(version, middlewares = []) {
        this.version = version;
        _Client_commands.set(this, {});
        this.id = crypto.randomUUID();
        this.pipeline = new awqrd_util_1.Pipeline(...middlewares, this.execute.bind(this));
    }
    authApi(apiKey) { apiKey; return true; }
    execute(state) {
        return __awaiter(this, void 0, void 0, function* () {
            // todo: create an array of the properties of state from the key of the cmd.params
            let args = [];
            if (state.cmd.params.length === 0) {
                args.push(state);
            }
            else
                for (let param of state.cmd.params) {
                    args.push(state[param]);
                }
            return state.cmd.instance[state.cmd.key](...args);
        });
    }
    resolve(command, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            let cmd = __classPrivateFieldGet(this, _Client_commands, "f")[command];
            return yield this.pipeline.run({ ctx, args: {}, cmd, client: this, env: {}, id: this.id + "." + command, files: {} });
        });
    }
    add(name, instance, key, config, params) {
        if (__classPrivateFieldGet(this, _Client_commands, "f")[name] !== undefined)
            throw Error(`Parse error: DUPLICATE COMMAND ${name}`);
        __classPrivateFieldGet(this, _Client_commands, "f")[name] = { instance, key, config, name, params };
    }
}
exports.Client = Client;
_Client_commands = new WeakMap();
