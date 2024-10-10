import {CometLogger, CometResult, CometState} from "@affinity-lab/comet";

export function renderMiddleware<REQ = any>(logger?: CometLogger<REQ>) {
	return async function (state: CometState<REQ>, next: () => Promise<CometResult>): Promise<Response> {
		try {
			if (logger?.requestLog) logger.requestLog(state);
			let result = await next();
			let response = Response.json(result.result, {status: result.status})
			result.headers.forEach((h) => response.headers.append(h[0], h[1]));
			if (logger?.resultLog) logger.resultLog(state, result);
			return response;
		} catch (error) {
			if (logger?.errorLog) logger.errorLog(state, error);
			return Response.json("", {status: 500})
		}
	}
}
