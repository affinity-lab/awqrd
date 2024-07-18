import {cometError, CometState} from "@affinity-lab/comet";
import type {Middleware} from "@affinity-lab/util";
import {RequestEvent} from "@sveltejs/kit";
import {reform} from "reformdata";


export class FetchArgsMiddleware implements Middleware {

	constructor() {}

	async handle(state: CometState<RequestEvent>, next: Function) {
		let {args, files, params} = await this.argParser(state.ctx);
		state.args = args;
		state.files = files;
		state.params = params;
		return await next();
	}

	async argParser(ctx: RequestEvent): Promise<{ args: any, files: any, params: any }> {
		let contentType = ctx.request.headers.get("Content-type");
		let args: any = {}, params: any = {}, files: any = {};
		if (contentType === "application/json") {
			args = await ctx.request.json();
		} else if (contentType?.startsWith("multipart/form-data")) {
			let reformData = reform(await ctx.request.formData()) as Record<string, any>
			for (let arg in reformData) {
				if (reformData[arg] instanceof File) files[arg] = [reformData[arg]];
				else if (Array.isArray(reformData[arg]) && reformData[arg][0] instanceof File) files[arg] = reformData[arg];
				else args[arg] = reformData[arg];
			}
		} else {
			throw cometError.contentTypeNotAccepted(contentType ?? "undefined")
		}
		ctx.url.searchParams.forEach((value, key) => params[key] = value)
		return {files, args, params}
	}
}
