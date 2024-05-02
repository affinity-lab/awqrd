import { Hono } from "hono";
/**
 * Function for serving images from a specified directory with dynamic URL paths and image processing.
 *
 * @param {Hono} app - The Hono application instance
 * @param {string} imgPath - The path to the image directory
 * @param {string} prefix - The prefix for the image server URL
 * @param {string} filesPath - The path to the files directory
 * @param {boolean} skipHashCheck - Flag to skip hash check for images
 */
export declare function stormImgServerHono(app: Hono, imgPath: string, prefix: string, filesPath: string, skipHashCheck?: boolean): void;
