import {createThumbnail, parseImgParams} from "@affinity-lab/storm-storage";
import {fileExists} from "@affinity-lab/util";
import {Hono} from "hono";
import {serveStatic} from "hono/bun";
import Path from "path";
import {filePathFromUrl} from "./storm-storage-file-server";

/**
 * Function for serving images from a specified directory with dynamic URL paths and image processing.
 *
 * @param {Hono} app - The Hono application instance
 * @param {string} imgPath - The path to the image directory
 * @param {string} prefix - The prefix for the image server URL
 * @param {string} filesPath - The path to the files directory
 * @param {boolean} skipHashCheck - Flag to skip hash check for images
 */
export function stormImgServer(app: Hono, imgPath: string, prefix: string, filesPath: string) {
	prefix = prefix.replace(/\/+/g, '/').replace(/^\/|\/$/g, '')
	app.get(
		`/${prefix}/:collection-with-id/:img/:file`,
		(c, next) => {
			return serveStatic({
				root: imgPath,
				rewriteRequestPath: (path: string) => path.substring(1 + prefix.length + 1).replaceAll("/", "-")
			})(c, next)},
		async (c, next) => {
			// create original file path
			let file = [c.req.param("collection-with-id"), c.req.param("file")].join("/");
			file = Path.join(Path.dirname(file), Path.basename(file, Path.extname(file))).replaceAll("\\", "/");
			file = Path.join(filesPath, filePathFromUrl(file)).replaceAll("\\", "/")

			// check if file exits
			if (!await fileExists(file)) return c.notFound();

			// parse image params
			let imgParams = parseImgParams(c.req.param("img"))
			if (imgParams === undefined) return c.notFound();

			const img = Path.join(imgPath, [c.req.param("collection-with-id"), c.req.param("img"), c.req.param("file")].join("-")).replaceAll("\\", "/");

			await createThumbnail(file, img, imgParams);
			await next()
		},
		(c, next) => {
			return serveStatic({
				root: imgPath,
				rewriteRequestPath: (path: string) => path.substring(1 + prefix.length + 1).replaceAll("/", "-")
			})(c, next)}
	)
}