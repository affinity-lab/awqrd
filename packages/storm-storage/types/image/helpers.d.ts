import type { ImgFocus } from "./types.ts";
export type ImgParams = {
    width: number;
    height: number;
    density: number;
    focus: ImgFocus;
};
/**
 * Parses the given image parameters string and returns an ImgParams object if the string matches the expected format.
 *
 * @param {string} img - the image parameter string to parse
 * @return {ImgParams | undefined} the parsed ImgParams object, or undefined if the string does not match the expected format
 */
export declare function parseImgParams(img: string): ImgParams | undefined;
/**
 * Generate a thumbnail image based on the input source image with specified parameters.
 *
 * @param {string} source - The path to the source image.
 * @param {string} output - The path where the thumbnail image will be saved.
 * @param {ImgParams} imgParams - Object containing parameters for generating the thumbnail.
 * @return {Promise<void>} A Promise that resolves when the thumbnail image is successfully created.
 */
export declare function createThumbnail(source: string, output: string, imgParams: ImgParams): Promise<void>;
