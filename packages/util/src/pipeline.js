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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pipeline = exports.pipeline = void 0;
/** Executes a pipeline of middlewares in a specific order.
 * @param {STATE} state - The state object to pass through the pipeline.
 * @param {Array<MiddlewareFn<STATE> | Middleware<STATE>} middlewares - The middlewares to execute in the pipeline.
 * @returns {Promise<any>} A promise that resolves after executing all middlewares in the pipeline.
 * @template STATE - The type of the state object.
 * @template RES - The type of the result object.
 */
function pipeline(state) {
    var middlewares = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middlewares[_i - 1] = arguments[_i];
    }
    return __awaiter(this, void 0, void 0, function () {
        var middleware, next;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    middleware = middlewares.shift();
                    if (middleware === undefined)
                        throw Error('Middleware not found!');
                    next = function () { return pipeline.apply(void 0, __spreadArray([state], middlewares, false)); };
                    if (!(typeof middleware === "function")) return [3 /*break*/, 2];
                    return [4 /*yield*/, middleware(state, next)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    if (!(typeof middleware === "object")) return [3 /*break*/, 4];
                    return [4 /*yield*/, middleware.handle(state, next)];
                case 3: return [2 /*return*/, _a.sent()];
                case 4: throw new Error("some error occured in pipeline execution");
            }
        });
    });
}
exports.pipeline = pipeline;
/** Represents a pipeline of middlewares.
 * @template STATE - The type of the state object.
 * @template RES - The type of the result object.
 * */
var Pipeline = /** @class */ (function () {
    /** Initializes a new instance of the Pipeline class.
     * @param {Array<MiddlewareFn<STATE> | Middleware<STATE>} middlewares - The middlewares to execute in the pipeline.
     */
    function Pipeline() {
        var middlewares = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            middlewares[_i] = arguments[_i];
        }
        this.middlewares = middlewares;
    }
    /** Executes the pipeline with the specified state object.
     * @param {STATE} state - The state object to pass through the pipeline.
     * @returns {Promise<RES>} A promise that resolves with the result of the pipeline execution.
     */
    Pipeline.prototype.run = function (state) {
        return pipeline.apply(void 0, __spreadArray([state], this.middlewares, false));
    };
    return Pipeline;
}());
exports.Pipeline = Pipeline;