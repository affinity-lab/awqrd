import {CometState} from "../client/comet-state";
import {reform} from "reformdata";
import {cometError} from "../error";
import {CometResult} from "../comet-result";
import {ParseRequestOptions} from "../types";


function parseRequest<REQ extends {request: any, cookies: any, url: any} = any>(options?: ParseRequestOptions) {
	return async function (state: CometState<REQ>, next: () => Promise<CometResult>) {
		let ctx = state.ctx;
		let contentType = ctx.request.headers.get("Content-type");
		let args: Record<string, any> = {};
		let params: Record<string, string> = {};
		let files: Record<string, Array<any>> = {};
		let headers: Record<string, string> = {};
		let cookies: Record<string, string> = {};

		if (contentType === "application/json") {
			// read json args
			args = await ctx.request.json();
		} else if (contentType?.startsWith("multipart/form-data")) {
			// read form args and files
			let reformData = reform(await ctx.request.formData()) as Record<string, any>;
			for (let arg in reformData) {
				if (reformData[arg] instanceof File) files[arg] = [reformData[arg]];
				else if (Array.isArray(reformData[arg]) && reformData[arg][0] instanceof File) files[arg] = reformData[arg];
				else args[arg] = reformData[arg];
			}
		} else {
			throw cometError.contentTypeNotAccepted(contentType ?? "undefined")
		}
		// read params
		ctx.url.searchParams.forEach((value: string, key: string) => params[key] = value);

		// read cookies
		if (options?.cookies?.length) options.cookies.map(cookie => cookies[cookie] = ctx.cookies.get(cookie));

		// read headers
		if (options?.headers?.length) options.headers.map(header => headers[header] = ctx.request.headers.get(header));

		state.args = args;
		state.files = files;
		state.params = params;
		state.cookies = cookies;
		state.headers = headers;

		return await next();
	}
}