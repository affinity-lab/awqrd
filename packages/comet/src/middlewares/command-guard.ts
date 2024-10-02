import {CometResult} from "../comet-result";
import {ExtendedError} from "@affinity-lab/util";
import {AuthState, getAuthState} from "../auth-state";
import {CometState} from "../client/comet-state";

export function commandGuardMiddleware<CTX extends {params: any} = any>(rules: Record<string, (authState: AuthState) => boolean>) {
	return async function (state: CometState<CTX>, next: () => Promise<CometResult>): Promise<CometResult> {
		let authState = getAuthState(state.env);
		let command = state.ctx.params.command!;
		while (command) {
			if (rules[command]) {
				if (authState.auth === undefined) {
					throw new ExtendedError("Unauthorized", "UNAUTHORIZED", undefined, 401);
				} else {
					if (!rules[command](authState)) throw new ExtendedError("Unauthorized", "FORBIDDEN", undefined, 403);
					break;
				}
			}
			let p = command.split(".");
			p.pop();
			command = p.join(".");
		}
		return next();
	}
}