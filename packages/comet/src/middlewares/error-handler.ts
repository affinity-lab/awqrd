import {ErrorHandler} from "../types";
import {CometState} from "../client/comet-state";
import {CometResult} from "../comet-result";

function errorHandlerMiddleware<REQ = any>(...handlers: Array<ErrorHandler>) {
	return async function (state: CometState<REQ>, next: () => Promise<CometResult>): Promise<CometResult> {
		try {
			return await next();
		} catch (error: any) {
			for (let handler of handlers) {
				let res = await handler(error);
				if (res !== null) return res;
			}
			throw error;
		}
	}
}