import {fileExists} from "@affinity-lab/util";
import {createHash} from "crypto";
import {Hono} from "hono";
import {serveStatic} from "hono/bun";
import Path from "path";
import {filePathFromUrl} from "./storm-storage-file-server";
import {createThumbnail, parseImgParams} from "./helpers";

/**
 * Function for serving images from a specified directory with dynamic URL paths and image processing.
 *
 * @param {Hono} app - The Hono application instance
 * @param {string} imgPath - The path to the image directory
 * @param {string} prefix - The prefix for the image server URL
 * @param {string} filesPath - The path to the files directory
 * @param {boolean} skipHashCheck - Flag to skip hash check for images
 */
export function stormStorageImgServerHono(app: Hono, imgPath: string, prefix: string, filesPath: string, skipHashCheck: boolean = false) {
	prefix = prefix.replace(/\/+/g, '/').replace(/^\/|\/$/g, '')
	app.get(
		`/${prefix}/:hash/:collection-with-id/:img/:file`,
		serveStatic({
			root: imgPath,
			rewriteRequestPath: (path: string) => path.substring(1 + prefix.length + 1 + 6 + 1).replaceAll("/", "-")
		}),
		async (c, next) => {
			// create original file path
			let file = [c.req.param("collection-with-id"), c.req.param("file")].join("/");
			file = Path.join(Path.dirname(file), Path.basename(file, Path.extname(file)));
			file = Path.join(filesPath, filePathFromUrl(file))

			// check if file exits
			if (!await fileExists(file)) return c.notFound();

			// check hash
			let hash = createHash("md5").update([c.req.param("collection-with-id"), c.req.param("img"), c.req.param("file")].join("/")).digest("hex").substring(0, 6);
			console.log(hash)
			if (hash !== c.req.param("hash") && !skipHashCheck) return c.notFound();

			// parse image params
			let imgParams = parseImgParams(c.req.param("img"))
			if (imgParams === undefined) return c.notFound();

			const img = Path.join(imgPath, [c.req.param("collection-with-id"), c.req.param("img"), c.req.param("file")].join("-"));

			await createThumbnail(file, img, imgParams);
			next()
		},
		serveStatic({
			root: imgPath,
			rewriteRequestPath: (path: string) => path.substring(1 + prefix.length + 1 + 6 + 1).replaceAll("/", "-")
		})
	)
}