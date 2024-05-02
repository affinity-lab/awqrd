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
exports.getUniqueFilename = void 0;
const file_exists_1 = require("./file-exists");
const path_1 = __importDefault(require("path"));
/**
 * Generates a unique filename by appending a numerical suffix to the filename if it already exists in the specified directory.
 *
 * @param {string} directory - The directory path where the filename should be unique.
 * @param {string} filename - The original filename.
 * @returns {Promise<string>} A Promise that resolves to a unique filename that does not exist in the specified directory.
 */
function getUniqueFilename(directory, filename) {
    return __awaiter(this, void 0, void 0, function* () {
        const baseName = path_1.default.basename(filename, path_1.default.extname(filename));
        const extName = path_1.default.extname(filename);
        let newName = filename;
        let count = 1;
        while (yield (0, file_exists_1.fileExists)(path_1.default.resolve(directory, newName)))
            newName = `${baseName}(${count++})${extName}`;
        return newName;
    });
}
exports.getUniqueFilename = getUniqueFilename;
