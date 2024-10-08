import {createThumbnail, parseImgParams} from "@affinity-lab/storm-storage";
import {fileExists, joinPath} from "@affinity-lab/util";
import {redirect, type RequestEvent} from "@sveltejs/kit";


import {ImgServerFactoryOptions} from "./types";

export function imgServerFactory(
	imgPath: string,
	filePath: string,
	options: ImgServerFactoryOptions
): (event: RequestEvent) => Promise<Response> {
	return async function (event: RequestEvent) {

		let namedImageDimensions = options.namedImageDimensions;
		let allowFree = options.allowFree ?? false;
		let fileNameParam = options.fileNameParam ?? "param"

		const regex = /^([^.]+)\.([^.]+)\.(.{6})-([^-]+)-(.+)\.([^.]+)$/;

		let img = event.params[fileNameParam]!;

		const matches = img!.match(regex);
		if (matches) {
			let [entity, collection, id, dimensions, filename, extension]: Array<string> = matches.slice(1);

			let file = joinPath(filePath, entity + "." + collection, `${id.slice(0, 2)}/${id.slice(2, 4)}/${id.slice(4, 6)}`, filename);
			if (!await fileExists(file)) return new Response('', {status: 404});

			if (dimensions.startsWith("~")) {
				let name = dimensions.match(/~(.*?)@.+/)?.[1];
				if (typeof name === "undefined" ||
					typeof namedImageDimensions === "undefined" ||
					(
						(
							typeof namedImageDimensions[entity] === "undefined" ||
							typeof namedImageDimensions[entity][collection] === "undefined" ||
							typeof namedImageDimensions[entity][collection][name] === "undefined"
						) && typeof namedImageDimensions["_"]["_"][name] === "undefined"
					)
				) return new Response('', {status: 404});
				let dim = namedImageDimensions[entity][collection][name] || namedImageDimensions["_"]["_"][name];
				dimensions = dimensions.replace("~" + name, (dim.width ?? "") + "x" + (dim.height ?? ""));
			} else if (!allowFree) {
				return new Response('', {status: 404});
			}

			let imgParams = parseImgParams(dimensions);
			if (!imgParams) return new Response('', {status: 404});

			let imgFile = joinPath(imgPath, img);

			await createThumbnail(file, imgFile, imgParams);
			if (!await fileExists(imgFile)) return new Response('', {status: 404});

			throw redirect(302, event.request.url);
		}
		return new Response('', {status: 404});
	}
}