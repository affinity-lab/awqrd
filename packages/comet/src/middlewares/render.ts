import type {Middleware} from "@affinity-lab/util";
import {ExtendedError} from "@affinity-lab/util";
import {CometState} from "../client/comet-state";
import {CometResult} from "../comet-result";
import {cometError} from "../error";


export class RenderMiddleware<RESPONSE = CometResult> implements Middleware {

	private readonly errorHandlers: Array<(error: any) => ExtendedError | undefined | void>;

	protected responseFactory(result: CometResult): any {
		return result;
	}

	constructor(
		...errorHandlers: Array<(error: any) => ExtendedError | undefined | void>
	) {
		this.errorHandlers = errorHandlers;
	}

	async handle(state: CometState, next: Function): Promise<RESPONSE> {
		try {
			if (state.client.unsupported) throw cometError.client.unsupported();
			let result = await next();
			return this.responseFactory(result instanceof CometResult ? result : new CometResult(result));
		} catch (error) {
			for (let errorHandler of this.errorHandlers) error = errorHandler(error) ?? error;
			return this.responseFactory(new CometResult(error, error instanceof ExtendedError ? error.httpResponseCode : 500))
		}
	}
}
