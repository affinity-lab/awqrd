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
exports.imgCleanupFactory = void 0;
const fast_glob_1 = require("fast-glob");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * Generates a function that cleans up image files based on the provided parameters.
 *
 * @param {string} name - the name to be used in the image file
 * @param {number} id - the id to be used in the image file
 * @param {string} file - the file extension to be used in the image file
 * @return {Promise<void>} a Promise that resolves when the image files are successfully deleted
 */
function imgCleanupFactory(imgPath) {
    return (name, id, file) => __awaiter(this, void 0, void 0, function* () {
        let files = yield (0, fast_glob_1.glob)(path_1.default.join(imgPath, `${name}.${id.toString(36).padStart(6, "0")}.*.${file}.*`));
        files.map(file => fs_1.default.promises.unlink(file));
    });
}
exports.imgCleanupFactory = imgCleanupFactory;
