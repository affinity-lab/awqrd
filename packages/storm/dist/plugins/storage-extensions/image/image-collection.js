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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageCollection = void 0;
const awqrd_util_1 = require("@affinity-lab/awqrd-util/");
const collection_1 = require("../../storage/collection");
const types_1 = require("./types");
class ImageCollection extends collection_1.Collection {
    constructor(name, groupDefinition, rules) {
        super(name, groupDefinition, rules);
        this.writableMetaFields = {
            title: { type: "string" },
            focus: { type: "enum", options: types_1.imgFocusOptions }
        };
        this.rules.ext = [".png", ".webp", ".gif", ".jpg", ".jpeg", ".tiff"];
    }
    prepareFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const descriptor = new awqrd_util_1.FileDescriptor(file.file);
            let img = yield descriptor.image;
            return {
                file, metadata: {
                    width: img === null || img === void 0 ? void 0 : img.meta.width,
                    height: img === null || img === void 0 ? void 0 : img.meta.height,
                    color: img === null || img === void 0 ? void 0 : img.stats.dominant,
                    animated: (img === null || img === void 0 ? void 0 : img.meta.pages) ? img.meta.pages > 1 : false,
                    focus: "entropy"
                }
            };
        });
    }
}
exports.ImageCollection = ImageCollection;
