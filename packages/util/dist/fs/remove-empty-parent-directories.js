"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.removeEmptyParentDirectories = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * Recursively removes empty directories in the directory structure.
 * Starts from the specified directory and moves upwards,
 * removing empty directories until it encounters a non-empty directory.
 * @param {string} dir - The directory to start removing empty directories from.
 * @returns {Promise<void>} A Promise that resolves when the operation completes.
 */
function removeEmptyParentDirectories(dir) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const parent = path.parse(dir).dir;
            const list = yield fs.promises.readdir(dir);
            if (list.length === 0) {
                yield fs.promises.rmdir(dir);
                yield removeEmptyParentDirectories(parent);
            }
        }
        catch (error) {
            console.error(`Error removing directory: ${dir}`, error);
        }
    });
}
exports.removeEmptyParentDirectories = removeEmptyParentDirectories;
