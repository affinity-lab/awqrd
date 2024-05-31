import type {Middleware} from "@affinity-lab/util";

import {CometState} from "../client/comet-state";

export class FetchArgsMiddleware implements Middleware {

	constructor(protected argParser: (ctx: any) => Promise<{ args: any, files: any, params: any }>) {}

	async handle(state: CometState, next: Function) {
		let {args, files, params} = await this.argParser(state.ctx);
		state.args = args;
		state.files = files;
		state.params = params;
		return await next();
	}
}
