import {type CometState} from "@affinity-lab/comet";
import {ExtendedError, type Middleware, pickFields} from "@affinity-lab/util";
import {ZodError} from "zod";
import {type StatusCode} from "hono/dist/types/utils/http-status";

export class ErrorHandlerMiddleware implements Middleware {
	private readonly errorHandler?: (error: any) => void;
	constructor(logger?: {log: (...args: any) => any}) {
		if(logger) this.errorHandler = (e: any) => !(e instanceof ExtendedError) && !(e instanceof ZodError) && logger.log(e);
	}

	async handle(state: CometState, next: Function) {
		try {
			return state.ctx.json(await next())
		} catch (e) {
			if (this.errorHandler !== undefined) {this.errorHandler(e)}
			if(e instanceof ExtendedError) return state.ctx.json({error: e}, e.httpResponseCode as StatusCode);
			else if(e instanceof ZodError) {
				let errors: Record<string, any> = {}
				for (let i of e.issues) !errors[i.path[0]] ? errors[i.path[0]] = [pickFields(i, "code", "message")] : errors[i.path[0]].push(pickFields(i, "code", "message"));
				return state.ctx.json(errors, 422);
			}
			else return state.ctx.json({error: e}, 500);
		}
	}
}