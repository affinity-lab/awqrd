import {z} from "zod";
import type {Middleware} from "@affinity-lab/awqrd-util";
import type {CometState} from "../client/client";
import {cometError} from "../error";

export class ValidateMiddleware implements Middleware {
	async handle(state: CometState, next: Function) {
		if (typeof state.cmd.config.validate === "object" && state.cmd.config.validate instanceof z.ZodObject) {
			let parsed = state.cmd.config.validate.safeParse(state.args);
			if (!parsed.success) throw cometError.validation(parsed.error.issues);
			state.args = parsed.data;
		}
		return await next()
	}
}