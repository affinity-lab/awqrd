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
exports.loadModuleDefaultExports = void 0;
const fast_glob_1 = __importDefault(require("fast-glob"));
const path_1 = __importDefault(require("path"));
/**
 * Loads default exports from modules in a specified directory.
 *
 * @template T - The type of the default export.
 * @param {string} dir - The directory containing the modules.
 * @returns {Array<T>} An array of default exports from the loaded modules.
 */
function loadModuleDefaultExports(dir) {
    // Initialize an empty array to store the loaded modules
    const modules = [];
    // Get the list of files in the specified directory with .ts or .js extension
    const records = fast_glob_1.default.globSync(path_1.default.join(dir + "/*.{ts,js}").replaceAll("\\", "/"));
    // Load each module asynchronously and push the default export into the 'modules' array
    records.map((filename) => __awaiter(this, void 0, void 0, function* () {
        let module = require(filename).default;
        modules.push(module);
    }));
    // Return the array of default exports
    return modules;
}
exports.loadModuleDefaultExports = loadModuleDefaultExports;
