export type State<T = {}> = Record<string, any> & T;
/**
 * Represents an interface for a block in a process pipeline.
 * @template OPTIONS - The type of options for the block.
 */
interface Block<OPTIONS extends string> {
    /**
     * Prepends a segment to the block.
     * @param {Function} segment - The segment function to prepend.
     * @returns The updated block runner instance.
     */
    prepend: (segment: Function) => Record<OPTIONS, BlockRunner<OPTIONS>>;
    /**
     * Appends a segment to the block.
     * @param {Function} segment - The segment function to append.
     * @returns The updated block runner instance.
     */
    append: (segment: Function) => Record<OPTIONS, BlockRunner<OPTIONS>>;
}
/**
 * Represents a block runner that executes segments in a process pipeline.
 * @template OPTIONS - The type of options for the block runner.
 */
declare class BlockRunner<OPTIONS extends string> implements Block<OPTIONS> {
    #private;
    readonly pipeline: ProcessPipeline<OPTIONS>;
    constructor(pipeline: ProcessPipeline<OPTIONS>);
    /**
     * Runs the block runner by executing segments in the specified order.
     * @param {object | undefined} ctx - The context object.
     * @param {State} state - The state object to pass through the block runner.
     * @returns {Promise<void>} A promise that resolves after executing all segments.
     */
    run(ctx: object | undefined, state: State): Promise<void>;
    /**
     * Prepends a segment to the block runner.
     * @param {Function} segment - The segment function to prepend.
     * @returns {Record<OPTIONS, BlockRunner<OPTIONS>>} The updated block runner instance.
     */
    prepend(segment: Function): Record<OPTIONS, BlockRunner<OPTIONS>>;
    /**
     * Appends a segment to the block runner.
     * @param {Function} segment - The segment function to append.
     * @returns {Record<OPTIONS, BlockRunner<OPTIONS>>} The updated block runner instance.
     */
    append(segment: Function): Record<OPTIONS, BlockRunner<OPTIONS>>;
}
/**
 * Represents a process pipeline for executing blocks of functions in a specific order.
 * @template OPTIONS - The type of options for the process pipeline.
 */
export declare class ProcessPipeline<OPTIONS extends string = string> {
    #private;
    private readonly names;
    /**
     * Accessible blocks of the process pipeline.
     * @type {Record<OPTIONS, Block<OPTIONS>>}
     */
    readonly blocks: Record<OPTIONS, Block<OPTIONS>>;
    /**
     * Initializes the ProcessPipeline with the provided names.
     * @param {...OPTIONS} names - The names of the blocks in the process pipeline.
     */
    constructor(...names: OPTIONS[]);
    /**
     * Runs the process pipeline by executing blocks in the specified order.
     * @param {object | undefined} ctx - The context object.
     * @param {Record<string, any>} state - The state object to pass through the pipeline.
     * @returns {Promise<Record<string, any>>} A promise that resolves to the final state after executing all blocks.
     */
    run(ctx: object | undefined, state: Record<string, any>): Promise<Record<string, any>>;
    /**
     * Sets up the process pipeline blocks with the provided functions.
     * @param {Partial<Record<OPTIONS, [Function] | Function>>} blocks - The functions to set up for each block.
     * @returns {this} The updated ProcessPipeline instance.
     */
    setup(blocks: Partial<Record<OPTIONS, [Function] | Function>>): this;
}
export {};
