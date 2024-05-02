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
exports.Pipeline = exports.pipeline = void 0;
/** Executes a pipeline of middlewares in a specific order.
 * @param {STATE} state - The state object to pass through the pipeline.
 * @param {Array<MiddlewareFn<STATE> | Middleware<STATE>} middlewares - The middlewares to execute in the pipeline.
 * @returns {Promise<any>} A promise that resolves after executing all middlewares in the pipeline.
 * @template STATE - The type of the state object.
 * @template RES - The type of the result object.
 */
function pipeline(state, ...middlewares) {
    return __awaiter(this, void 0, void 0, function* () {
        let middleware = middlewares.shift();
        if (middleware === undefined)
            throw Error('Middleware not found!');
        let next = () => pipeline(state, ...middlewares);
        if (typeof middleware === "function")
            return yield middleware(state, next);
        else if (typeof middleware === "object")
            return yield middleware.handle(state, next);
        throw new Error("some error occured in pipeline execution");
    });
}
exports.pipeline = pipeline;
/** Represents a pipeline of middlewares.
 * @template STATE - The type of the state object.
 * @template RES - The type of the result object.
 * */
class Pipeline {
    /** Initializes a new instance of the Pipeline class.
     * @param {Array<MiddlewareFn<STATE> | Middleware<STATE>} middlewares - The middlewares to execute in the pipeline.
     */
    constructor(...middlewares) {
        this.middlewares = middlewares;
    }
    /** Executes the pipeline with the specified state object.
     * @param {STATE} state - The state object to pass through the pipeline.
     * @returns {Promise<RES>} A promise that resolves with the result of the pipeline execution.
     */
    run(state) {
        return pipeline(state, ...this.middlewares);
    }
}
exports.Pipeline = Pipeline;
