import {NonEmptyArray} from "../types";

export function joinPath(...args: NonEmptyArray<string>) {
	let p = args.map(i=>i.replaceAll("\\", "/").replace(/^\/+|\/+$/g, '')).filter(i=>!!i).join("/");
	return args[0].startsWith("/") ? "/" + p : p;
}
