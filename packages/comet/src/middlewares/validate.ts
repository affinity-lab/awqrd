import {CometState} from "../client/comet-state";
import {cometError} from "../error";

export function validateMiddleware() {
	return async function (state: CometState, next: Function) {
		if (typeof state.cmd.config.validate === "object") {
			let parsed = state.cmd.config.validate.safeParse(state.args);
			if (!parsed.success) throw cometError.validation(parsed.error.issues);
			state.args = {...state.args, ...parsed.data};
		}
		return await next()
	}
}