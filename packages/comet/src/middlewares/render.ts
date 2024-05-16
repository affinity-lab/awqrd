import {cometError} from "@affinity-lab/comet/src/error";
import type {Middleware} from "@affinity-lab/util";
import {ExtendedError} from "@affinity-lab/util";
import {StatusCode} from "hono/dist/types/utils/http-status";
import type {CometState} from "../client/client";

export class RenderMiddleware implements Middleware {

	constructor(private errorHandler?: (error: any) => any) {}

	async handle(state: CometState, next: Function) {
		try {
			if (state.client.unsupported) throw cometError.client.unsupported();
			return state.ctx.json(await next())
		} catch (error) {
			if (this.errorHandler !== undefined) error = this.errorHandler(error) ?? error
			if (error instanceof ExtendedError) return state.ctx.json({error: error}, error.httpResponseCode as StatusCode)
			else return state.ctx.json({error: error}, 500)
		}
	}
}