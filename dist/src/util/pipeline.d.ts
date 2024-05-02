/** Represents a middleware function.
 * @template T - The type of the state object.
 * @param state - The state object to pass through the middleware.
 * @param next - The next middleware function in the pipeline.
 * @returns A promise that resolves after executing the middleware.
 */
export type MiddlewareFn<T = any> = (state: T, next: () => Promise<any>) => Promise<any>;
/** Represents a middleware object.
 * @template T - The type of the state object.
 */
export type Middleware<T = any> = any & {
    handle: MiddlewareFn<T>;
};
/** Executes a pipeline of middlewares in a specific order.
 * @param {STATE} state - The state object to pass through the pipeline.
 * @param {Array<MiddlewareFn<STATE> | Middleware<STATE>} middlewares - The middlewares to execute in the pipeline.
 * @returns {Promise<any>} A promise that resolves after executing all middlewares in the pipeline.
 * @template STATE - The type of the state object.
 * @template RES - The type of the result object.
 */
export declare function pipeline<STATE = any, RES = any>(state: STATE, ...middlewares: Array<MiddlewareFn<STATE> | Middleware<STATE>>): Promise<any>;
/** Represents a pipeline of middlewares.
 * @template STATE - The type of the state object.
 * @template RES - The type of the result object.
 * */
export declare class Pipeline<STATE = any, RES = any> {
    /** The middlewares to execute in the pipeline. */
    private readonly middlewares;
    /** Initializes a new instance of the Pipeline class.
     * @param {Array<MiddlewareFn<STATE> | Middleware<STATE>} middlewares - The middlewares to execute in the pipeline.
     */
    constructor(...middlewares: Array<MiddlewareFn<STATE> | Middleware<STATE>>);
    /** Executes the pipeline with the specified state object.
     * @param {STATE} state - The state object to pass through the pipeline.
     * @returns {Promise<RES>} A promise that resolves with the result of the pipeline execution.
     */
    run(state: STATE): Promise<RES>;
}
