import type {Middleware} from "@affinity-lab/util";
import type {CometState} from "../client/client";
import {ExtendedError} from "@affinity-lab/util";
import {StatusCode} from "hono/dist/types/utils/http-status";

export class RenderMiddleware implements Middleware {

	constructor(private errorHandler?: (error: any) => void) {}

	async handle(state: CometState, next: Function) {
		try {
			return state.ctx.json(await next())
		} catch (e) {
			if (this.errorHandler !== undefined) {this.errorHandler(e)}
			if(e instanceof ExtendedError) return state.ctx.json({error: e}, e.httpResponseCode as StatusCode)
			else return state.ctx.json({error: e}, 500)
		}
	}
}