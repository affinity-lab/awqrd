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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileDescriptor = void 0;
const fs = __importStar(require("fs"));
const mime = __importStar(require("mime-types"));
const path = __importStar(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const materialize_it_1 = require("../materialize-it");
/**
 * Represents a file descriptor.
 */
class FileDescriptor {
    constructor(file) { this.file = fs.realpathSync(file); }
    ;
    /**
     * Retrieves the file stats asynchronously.
     */
    get stat() { return fs.promises.stat(this.file).catch(() => null); }
    ;
    /**
     * Retrieves the size of the file asynchronously.
     */
    get size() { return this.stat.then((stat) => stat !== null ? stat.size : 0); }
    ;
    /**
     * Checks if the file exists asynchronously.
     */
    get exists() { return this.stat.then((stat) => stat !== null); }
    ;
    /**
     * Retrieves the base name of the file.
     */
    get name() { return this.parsedPath.base; }
    ;
    /**
     * Parses the path of the file.
     */
    get parsedPath() { return path.parse(this.file); }
    ;
    /**
     * Retrieves the MIME type of the file.
     */
    get mimeType() { return mime.lookup(this.file); }
    ;
    /**
     * Checks if the file is an image.
     */
    get isImage() { return this.mimeType.toString().substring(0, 6) === "image/"; }
    ;
    /**
     * Retrieves image metadata and stats if the file is an image.
     */
    get image() {
        sharp_1.default.cache({ files: 0 });
        if (!this.isImage) {
            return Promise.resolve(null);
        }
        let img = (0, sharp_1.default)(this.file);
        return Promise.all([img.metadata(), img.stats()])
            .then((res) => ({ meta: res[0], stats: res[1] }));
    }
    ;
}
exports.FileDescriptor = FileDescriptor;
__decorate([
    materialize_it_1.MaterializeIt
], FileDescriptor.prototype, "stat", null);
__decorate([
    materialize_it_1.MaterializeIt
], FileDescriptor.prototype, "parsedPath", null);
__decorate([
    materialize_it_1.MaterializeIt
], FileDescriptor.prototype, "mimeType", null);
__decorate([
    materialize_it_1.MaterializeIt
], FileDescriptor.prototype, "isImage", null);
__decorate([
    materialize_it_1.MaterializeIt
], FileDescriptor.prototype, "image", null);
