import {CometState} from "../client/comet-state";
import {reform} from "reformdata";
import {cometError} from "../error";
import {CometResult} from "../comet-result";
import {ParseRequestOptions} from "../types";


export function fetchArgsMiddleware<REQ extends {req: any, cookies: any, url: any} = any>(options?: ParseRequestOptions) {
	return async function (state: CometState<REQ>, next: () => Promise<CometResult>) {
		let ctx = state.ctx;
		let contentType = ctx.req.header("Content-type");
		let args: Record<string, any> = {};
		let files: Record<string, Array<any>> = {};
		let headers: Record<string, string> = {};
		let cookies: Record<string, string> = {};
		if (contentType === "application/json") {
			args = await ctx.req.json();
		} else if (contentType?.startsWith("multipart/form-data")) {
			let reformData = reform(await ctx.req.formData()) as Record<string, any>
			for (let arg in reformData) {
				if (reformData[arg] instanceof File) files[arg] = [reformData[arg]];
				else if (Array.isArray(reformData[arg]) && reformData[arg][0] instanceof File) files[arg] = reformData[arg];
				else args[arg] = reformData[arg];
			}
		} else {
			throw cometError.contentTypeNotAccepted(contentType ?? "undefined")
		}

		// read cookies
		if (options?.cookies?.length) options.cookies.map(cookie => cookies[cookie] = ctx.cookies.get(cookie));

		// read headers
		if (options?.headers?.length) options.headers.map(header => headers[header] = ctx.req.header(header));

		state.args = args;
		state.files = files;
		state.params = ctx.req.query();
		state.cookies = cookies;
		state.headers = headers;

		return await next();


	}
}




// async (ctx: Context) => {
// 		let contentType = ctx.req.header("Content-type");
// 		let args: any = {}, params: any = {}, files: any = {};
// 		if (contentType === "application/json") {
// 			args = await ctx.req.json();
// 		} else if (contentType?.startsWith("multipart/form-data")) {
// 			let reformData = reform(await ctx.req.formData()) as Record<string, any>
// 			for (let arg in reformData) {
// 				if (reformData[arg] instanceof File) files[arg] = [reformData[arg]];
// 				else if (Array.isArray(reformData[arg]) && reformData[arg][0] instanceof File) files[arg] = reformData[arg];
// 				else args[arg] = reformData[arg];
// 			}
// 		} else {
// 			throw cometError.contentTypeNotAccepted(contentType ?? "undefined")
// 		}
// 		params = ctx.req.query();
// 		return {files, args, params}
// 	}