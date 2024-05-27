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
var BlockRunner = /** @class */ (function () {
    function BlockRunner(pipeline) {
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
    BlockRunner.prototype.run = function (ctx, state) {
        return __awaiter(this, void 0, void 0, function () { var _i, _a, segment; return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _i = 0, _a = __classPrivateFieldGet(this, _BlockRunner_segments, "f");
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    segment = _a[_i];
                    return [4 /*yield*/, segment.apply(ctx, [state])];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        }); });
    };
    /**
     * Prepends a segment to the block runner.
     * @param {Function} segment - The segment function to prepend.
     * @returns {Record<OPTIONS, BlockRunner<OPTIONS>>} The updated block runner instance.
     */
    BlockRunner.prototype.prepend = function (segment) {
        __classPrivateFieldGet(this, _BlockRunner_segments, "f").unshift(segment);
        return this.pipeline.blocks;
    };
    /**
     * Appends a segment to the block runner.
     * @param {Function} segment - The segment function to append.
     * @returns {Record<OPTIONS, BlockRunner<OPTIONS>>} The updated block runner instance.
     */
    BlockRunner.prototype.append = function (segment) {
        __classPrivateFieldGet(this, _BlockRunner_segments, "f").push(segment);
        return this.pipeline.blocks;
    };
    return BlockRunner;
}());
_BlockRunner_segments = new WeakMap();
/**
 * Represents a process pipeline for executing blocks of functions in a specific order.
 * @template OPTIONS - The type of options for the process pipeline.
 */
var ProcessPipeline = /** @class */ (function () {
    /**
     * Initializes the ProcessPipeline with the provided names.
     * @param {...OPTIONS} names - The names of the blocks in the process pipeline.
     */
    function ProcessPipeline() {
        var names = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            names[_i] = arguments[_i];
        }
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
        for (var _a = 0, names_1 = names; _a < names_1.length; _a++) {
            var name_1 = names_1[_a];
            __classPrivateFieldGet(this, _ProcessPipeline_blocks, "f")[name_1] = new BlockRunner(this);
        }
    }
    /**
     * Runs the process pipeline by executing blocks in the specified order.
     * @param {object | undefined} ctx - The context object.
     * @param {Record<string, any>} state - The state object to pass through the pipeline.
     * @returns {Promise<Record<string, any>>} A promise that resolves to the final state after executing all blocks.
     */
    ProcessPipeline.prototype.run = function (ctx, state) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, name_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, _a = this.names;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        name_2 = _a[_i];
                        return [4 /*yield*/, __classPrivateFieldGet(this, _ProcessPipeline_blocks, "f")[name_2].run(ctx, state)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, state];
                }
            });
        });
    };
    /**
     * Sets up the process pipeline blocks with the provided functions.
     * @param {Partial<Record<OPTIONS, [Function] | Function>>} blocks - The functions to set up for each block.
     * @returns {this} The updated ProcessPipeline instance.
     */
    ProcessPipeline.prototype.setup = function (blocks) {
        var _this = this;
        var _loop_1 = function (key) {
            if (Array.isArray(blocks[key]))
                blocks[key].forEach(function (fn) { return _this.blocks[key].append(fn); });
            if (blocks[key] instanceof Function)
                this_1.blocks[key].append(blocks[key]);
        };
        var this_1 = this;
        for (var key in blocks) {
            _loop_1(key);
        }
        return this;
    };
    return ProcessPipeline;
}());
exports.ProcessPipeline = ProcessPipeline;
_ProcessPipeline_blocks = new WeakMap();
