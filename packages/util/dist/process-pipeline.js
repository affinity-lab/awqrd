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
var _BlockRunner_segments, _ProcessPipeline_blocks;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessPipeline = void 0;
/**
 * Represents a block runner that executes segments in a process pipeline.
 * @template OPTIONS - The type of options for the block runner.
 */
class BlockRunner {
    constructor(pipeline) {
        this.pipeline = pipeline;
        _BlockRunner_segments.set(this, []
        /**
         * Runs the block runner by executing segments in the specified order.
         * @param {object | undefined} ctx - The context object.
         * @param {State} state - The state object to pass through the block runner.
         * @returns {Promise<void>} A promise that resolves after executing all segments.
         */
        );
    }
    /**
     * Runs the block runner by executing segments in the specified order.
     * @param {object | undefined} ctx - The context object.
     * @param {State} state - The state object to pass through the block runner.
     * @returns {Promise<void>} A promise that resolves after executing all segments.
     */
    run(ctx, state) {
        return __awaiter(this, void 0, void 0, function* () { for (const segment of __classPrivateFieldGet(this, _BlockRunner_segments, "f"))
            yield segment.apply(ctx, [state]); });
    }
    /**
     * Prepends a segment to the block runner.
     * @param {Function} segment - The segment function to prepend.
     * @returns {Record<OPTIONS, BlockRunner<OPTIONS>>} The updated block runner instance.
     */
    prepend(segment) {
        __classPrivateFieldGet(this, _BlockRunner_segments, "f").unshift(segment);
        return this.pipeline.blocks;
    }
    /**
     * Appends a segment to the block runner.
     * @param {Function} segment - The segment function to append.
     * @returns {Record<OPTIONS, BlockRunner<OPTIONS>>} The updated block runner instance.
     */
    append(segment) {
        __classPrivateFieldGet(this, _BlockRunner_segments, "f").push(segment);
        return this.pipeline.blocks;
    }
}
_BlockRunner_segments = new WeakMap();
/**
 * Represents a process pipeline for executing blocks of functions in a specific order.
 * @template OPTIONS - The type of options for the process pipeline.
 */
class ProcessPipeline {
    /**
     * Initializes the ProcessPipeline with the provided names.
     * @param {...OPTIONS} names - The names of the blocks in the process pipeline.
     */
    constructor(...names) {
        /**
         * Blocks within the process pipeline keyed by their respective options.
         * @type {Partial<Record<OPTIONS, BlockRunner<OPTIONS>>}
         */
        _ProcessPipeline_blocks.set(this, {});
        /**
         * Accessible blocks of the process pipeline.
         * @type {Record<OPTIONS, Block<OPTIONS>>}
         */
        this.blocks = __classPrivateFieldGet(this, _ProcessPipeline_blocks, "f");
        this.names = names;
        for (const name of names)
            __classPrivateFieldGet(this, _ProcessPipeline_blocks, "f")[name] = new BlockRunner(this);
    }
    /**
     * Runs the process pipeline by executing blocks in the specified order.
     * @param {object | undefined} ctx - The context object.
     * @param {Record<string, any>} state - The state object to pass through the pipeline.
     * @returns {Promise<Record<string, any>>} A promise that resolves to the final state after executing all blocks.
     */
    run(ctx, state) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const name of this.names)
                yield __classPrivateFieldGet(this, _ProcessPipeline_blocks, "f")[name].run(ctx, state);
            return state;
        });
    }
    /**
     * Sets up the process pipeline blocks with the provided functions.
     * @param {Partial<Record<OPTIONS, [Function] | Function>>} blocks - The functions to set up for each block.
     * @returns {this} The updated ProcessPipeline instance.
     */
    setup(blocks) {
        for (const key in blocks) {
            if (Array.isArray(blocks[key]))
                blocks[key].forEach(fn => this.blocks[key].append(fn));
            if (blocks[key] instanceof Function)
                this.blocks[key].append(blocks[key]);
        }
        return this;
    }
}
exports.ProcessPipeline = ProcessPipeline;
_ProcessPipeline_blocks = new WeakMap();
