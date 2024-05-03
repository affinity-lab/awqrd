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
exports.stormImgServerHono = void 0;
const bun_1 = require("hono/bun");
const path_1 = __importDefault(require("path"));
const storm_storage_server_1 = require("../../storage/helper/storm-storage-server");
const helpers_1 = require("./helpers");
const util_1 = require("@affinity-lab/util");
const crypto_1 = require("crypto");
/**
 * Function for serving images from a specified directory with dynamic URL paths and image processing.
 *
 * @param {Hono} app - The Hono application instance
 * @param {string} imgPath - The path to the image directory
 * @param {string} prefix - The prefix for the image server URL
 * @param {string} filesPath - The path to the files directory
 * @param {boolean} skipHashCheck - Flag to skip hash check for images
 */
function stormImgServerHono(app, imgPath, prefix, filesPath, skipHashCheck = false) {
    prefix = prefix.replace(/\/+/g, '/').replace(/^\/|\/$/g, '');
    app.get(`/${prefix}/:hash/:collection-with-id/:img/:file`, (0, bun_1.serveStatic)({
        root: imgPath,
        rewriteRequestPath: (path) => path.substring(1 + prefix.length + 1 + 6 + 1).replaceAll("/", "-")
    }), (c, next) => __awaiter(this, void 0, void 0, function* () {
        // create original file path
        let file = [c.req.param("collection-with-id"), c.req.param("file")].join("/");
        file = path_1.default.join(path_1.default.dirname(file), path_1.default.basename(file, path_1.default.extname(file)));
        file = path_1.default.join(filesPath, (0, storm_storage_server_1.filePathFromUrl)(file));
        // check if file exits
        if (!(yield (0, util_1.fileExists)(file)))
            return c.notFound();
        // check hash
        let hash = (0, crypto_1.createHash)("md5").update([c.req.param("collection-with-id"), c.req.param("img"), c.req.param("file")].join("/")).digest("hex").substring(0, 6);
        console.log(hash);
        if (hash !== c.req.param("hash") && !skipHashCheck)
            return c.notFound();
        // parse image params
        let imgParams = (0, helpers_1.parseImgParams)(c.req.param("img"));
        if (imgParams === undefined)
            return c.notFound();
        const img = path_1.default.join(imgPath, [c.req.param("collection-with-id"), c.req.param("img"), c.req.param("file")].join("-"));
        yield (0, helpers_1.createThumbnail)(file, img, imgParams);
        next();
    }), (0, bun_1.serveStatic)({
        root: imgPath,
        rewriteRequestPath: (path) => path.substring(1 + prefix.length + 1 + 6 + 1).replaceAll("/", "-")
    }));
}
exports.stormImgServerHono = stormImgServerHono;
