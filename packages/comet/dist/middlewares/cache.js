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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheMiddleware = void 0;
const crypto_1 = __importDefault(require("crypto"));
class CacheMiddleware {
    constructor(cache, defaultTtl = 60, defaultKeyFn = (state) => { return { id: state.id, args: state.args, env: state.env }; }) {
        this.cache = cache;
        this.defaultTtl = defaultTtl;
        this.defaultKeyFn = defaultKeyFn;
    }
    handle(state, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!state.cmd.config.cache)
                return yield next();
            let key = (state.cmd.config.cache.key === undefined) ? this.defaultKeyFn(state) : state.cmd.config.cache.key(state);
            if (typeof key !== "string")
                key = crypto_1.default.createHash("md5").update(JSON.stringify(key)).digest("hex");
            let cached = yield this.cache.get(key);
            if (cached) {
                return cached;
            }
            let value = yield next();
            yield this.cache.set({ key, value }, (_a = state.cmd.config.cache.ttl) !== null && _a !== void 0 ? _a : this.defaultTtl);
            return value;
        });
    }
}
exports.CacheMiddleware = CacheMiddleware;
