import {CometState} from "../client/comet-state";
import {CometResult} from "../comet-result";
import {CometLogger} from "../types";
import {Context} from "hono";

export function renderMiddleware<REQ extends Context = any>(logger?: CometLogger<REQ>) {
	return async function (state: CometState<REQ>, next: () => Promise<CometResult>): Promise<Response> {
		try {
			if (logger?.requestLog) logger.requestLog(state);
			let result = await next();
			let response = state.ctx.json(result.result, {status: result.status})
			result.headers.forEach((h) => state.ctx.header(h[0], h[1]));
			if (logger?.resultLog) logger.resultLog(state, result);
			return response;
		} catch (error) {
			if (logger?.errorLog) logger.errorLog(state, error);
			return state.ctx.json("", {status: 500})
		}
	}
}
