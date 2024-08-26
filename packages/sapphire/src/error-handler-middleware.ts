import {CometResult, type CometState} from "@affinity-lab/comet";
import {ExtendedError, type Middleware, pickFields} from "@affinity-lab/util";

export class ErrorHandlerMiddleware implements Middleware {
	private readonly errorHandler?: (error: any) => void;
	constructor(logger?: { log: (...args: any) => any }) {
		if (logger) this.errorHandler = (e: any) => !(e instanceof ExtendedError) && !(e.constructor.name === "ZodError") && logger.log(e);
	}

	async handle(state: CometState, next: Function): Promise<CometResult> {
		try {
			return await next()
		} catch (e: any) {
			if (this.errorHandler !== undefined) {this.errorHandler(e)}
			if (e.constructor.name === "ZodError" || e.httpResponseCode === 422) {
				let errors: Record<string, any> = {}
				for (let i of e instanceof ExtendedError ? e.details : e.issues) !errors[i.path[0]] ? errors[i.path[0]] = [pickFields(i, "code", "message")] : errors[i.path[0]].push(pickFields(i, "code", "message"));
				return new CometResult(errors, 422);
			}
			if (e instanceof ExtendedError) return new CometResult({error: e}, e.httpResponseCode);
			else return new CometResult({error: `Internal Server Error (${e})`}, 500);
		}
	}
}

export function zodErrorHandler(error: any) {
	if (error.constructor.name === "ZodError") {
		let errors: Record<string, any> = {};
		for (let i of error.issues) !errors[i.path[0]] ? errors[i.path[0]] = [pickFields(i, "code", "message")] : errors[i.path[0]].push(pickFields(i, "code", "message"));
		return new ExtendedError("Validation Error", "Zod", errors, 422);
	}
}