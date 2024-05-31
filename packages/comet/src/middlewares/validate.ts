import {z} from "zod";
import type {Middleware} from "@affinity-lab/util";

import {CometState} from "../client/comet-state";
import {cometError} from "../error";

export class ValidateMiddleware implements Middleware {
	async handle(state: CometState, next: Function) {
		if (typeof state.cmd.config.validate === "object") {
			let parsed = state.cmd.config.validate.safeParse(state.args);
			if (!parsed.success) throw cometError.validation(parsed.error.issues);
			state.args = {...state.args, ...parsed.data};
		}
		return await next()
	}
}