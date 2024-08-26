import {CometResult, RenderMiddleware} from "@affinity-lab/comet";

export class RenderMiddlewareSvelteKit extends RenderMiddleware {
	protected responseFactory(result: CometResult): Response {
		let response = Response.json(result.result, {status: result.status})
		result.headers.forEach((h) => response.headers.append(h[0], h[1]));
		return response;
	}
}
