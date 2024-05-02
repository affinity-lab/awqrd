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
exports.FetchArgsMiddleware = void 0;
const reformdata_1 = require("reformdata");
const error_1 = require("../error");
class FetchArgsMiddleware {
    handle(state, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let contentType = state.ctx.req.header("Content-type");
            if (contentType === "application/json") {
                state.args = yield state.ctx.req.json();
            }
            else if (contentType === null || contentType === void 0 ? void 0 : contentType.startsWith("multipart/form-data")) {
                let reformData = (0, reformdata_1.reform)(yield state.ctx.req.formData());
                for (let arg in reformData) {
                    if (reformData[arg] instanceof File)
                        state.files[arg] = [reformData[arg]];
                    else if (Array.isArray(reformData[arg]) && reformData[arg][0] instanceof File)
                        state.files[arg] = reformData[arg];
                    else
                        state.args[arg] = reformData[arg];
                }
            }
            else {
                throw error_1.cometError.contentTypeNotAccepted(contentType !== null && contentType !== void 0 ? contentType : "undefined");
            }
            return yield next();
        });
    }
}
exports.FetchArgsMiddleware = FetchArgsMiddleware;
