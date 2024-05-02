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
exports.createThumbnail = exports.parseImgParams = void 0;
const sharp_1 = __importDefault(require("sharp"));
/**
 * Parses the given image parameters string and returns an ImgParams object if the string matches the expected format.
 *
 * @param {string} img - the image parameter string to parse
 * @return {ImgParams | undefined} the parsed ImgParams object, or undefined if the string does not match the expected format
 */
function parseImgParams(img) {
    const regex = /^(?:(\d+)x(\d+)|(\d+)x|x(\d+))@?(\d)?x?\.?(centre|center|top|left|bottom|right|entropy|attention|box)?$/;
    const match = regex.exec(img);
    if (match) {
        const width = parseInt(match[1] || match[3] || "0");
        const height = parseInt(match[2] || match[4] || "0");
        const density = parseInt(match[5] || "1");
        let focus = (match[6] || 'entropy');
        if (width === 0 && height === 0)
            return;
        return { width, height, density, focus };
    }
}
exports.parseImgParams = parseImgParams;
/**
 * Generate a thumbnail image based on the input source image with specified parameters.
 *
 * @param {string} source - The path to the source image.
 * @param {string} output - The path where the thumbnail image will be saved.
 * @param {ImgParams} imgParams - Object containing parameters for generating the thumbnail.
 * @return {Promise<void>} A Promise that resolves when the thumbnail image is successfully created.
 */
function createThumbnail(source, output, imgParams) {
    return __awaiter(this, void 0, void 0, function* () {
        sharp_1.default.cache({ files: 0 });
        let meta = yield (0, sharp_1.default)(source).metadata();
        const oWidth = meta.width;
        const oHeight = meta.height;
        const oAspect = oWidth / oHeight;
        const focus = meta.pages > 1 ? "centre" : imgParams.focus;
        let width = imgParams.width === 0 ? imgParams.height * oAspect : imgParams.width;
        let height = imgParams.height === 0 ? imgParams.width / oAspect : imgParams.height;
        if (focus === "box") {
            const aspect = width / height;
            if (oAspect > aspect) {
                height = Math.floor(width / oAspect);
            }
            else {
                width = Math.floor(height * oAspect);
            }
            yield (0, sharp_1.default)(source, { animated: true })
                .resize(width, height, {
                kernel: sharp_1.default.kernel.lanczos3,
                fit: "contain",
                withoutEnlargement: true
            })
                .toFile(output);
        }
        else {
            if (oWidth < width) {
                height = Math.floor(height * oWidth / width);
                width = oWidth;
            }
            if (oHeight < height) {
                width = Math.floor(width * oHeight / height);
                height = oHeight;
            }
            yield (0, sharp_1.default)(source, { animated: true })
                .resize(width, height, {
                kernel: sharp_1.default.kernel.lanczos3,
                fit: "cover",
                position: focus,
                withoutEnlargement: true
            })
                .toFile(output);
        }
    });
}
exports.createThumbnail = createThumbnail;
