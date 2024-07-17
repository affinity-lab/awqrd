import type {Middleware} from "@affinity-lab/util";
import {ExtendedError} from "@affinity-lab/util";
import {CometState} from "../client/comet-state";
import {cometError} from "../error";


export type Result = { result: any, status: number }

export class RenderMiddleware implements Middleware {

	private readonly errorHandlers: Array<(error: any) => ExtendedError | undefined>;

	constructor(...errorHandlers: Array<(error: any) => ExtendedError | undefined>) {
		this.errorHandlers = errorHandlers;
	}

	async handle(state: CometState, next: Function): Promise<Result> {
		try {
			if (state.client.unsupported) throw cometError.client.unsupported();
			return {result: await next(), status: 200}
		} catch (error) {
			for (let errorHandler of this.errorHandlers) error = errorHandler(error) ?? error;
			if (error instanceof ExtendedError) return {result: error, status: error.httpResponseCode}
			else return {result: {error}, status: 500}
		}
	}
}
