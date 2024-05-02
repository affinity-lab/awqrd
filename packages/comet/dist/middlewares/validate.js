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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateMiddleware = void 0;
const zod_1 = require("zod");
const error_1 = require("../error");
class ValidateMiddleware {
    handle(state, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof state.cmd.config.validate === "object" && state.cmd.config.validate instanceof zod_1.z.ZodObject) {
                let parsed = state.cmd.config.validate.safeParse(state.args);
                if (!parsed.success)
                    throw error_1.cometError.validation(parsed.error.issues);
                state.args = parsed.data;
            }
            return yield next();
        });
    }
}
exports.ValidateMiddleware = ValidateMiddleware;
