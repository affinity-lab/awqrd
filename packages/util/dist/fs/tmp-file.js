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
exports.TmpFileFactory = exports.TmpFile = void 0;
const buffer_1 = require("buffer");
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class TmpFile {
    get filename() { return path_1.default.basename(this.file); }
    constructor(file) {
        this.file = file;
    }
    release() {
        fs_1.default.promises.unlink(this.file).then(() => fs_1.default.promises.rmdir(path_1.default.dirname(this.file)));
    }
}
exports.TmpFile = TmpFile;
/**
 * Factory class for creating temporary files.
 */
class TmpFileFactory {
    constructor(path) {
        this.path = path;
        new FinalizationRegistry((del) => { console.log("DELETED", del); });
    }
    get targetDir() {
        let targetDir = path_1.default.join(this.path, crypto_1.default.randomUUID());
        return fs_1.default.promises.mkdir(targetDir).then(() => targetDir);
    }
    createFromFile(file, removeOriginal = true) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createFromBuffer(file.name, buffer_1.Buffer.from(yield file.arrayBuffer()));
        });
    }
    createFromBuffer(filename, buffer) {
        return __awaiter(this, void 0, void 0, function* () {
            let target = path_1.default.join(yield this.targetDir, path_1.default.basename(filename));
            fs_1.default.writeFileSync(target, buffer);
            return new TmpFile(target);
        });
    }
    createFromFilePath(file, removeOriginal = true) {
        return __awaiter(this, void 0, void 0, function* () {
            let target = path_1.default.join(yield this.targetDir, path_1.default.basename(file));
            if (removeOriginal)
                yield fs_1.default.promises.rename(file, target);
            else
                yield fs_1.default.promises.copyFile(file, target);
            return new TmpFile(target);
        });
    }
}
exports.TmpFileFactory = TmpFileFactory;
