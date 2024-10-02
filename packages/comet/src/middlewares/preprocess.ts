import {CometState} from "../client/comet-state";
import {CometResult} from "../../types";

export function preprocessMiddleware<REQ = any>() {
	return async function (state: CometState<REQ>, next: () => Promise<CometResult>) {
		if (typeof state.cmd.config.preprocess === "function") await state.cmd.config.preprocess(state);
		if (Array.isArray(state.cmd.config.preprocess)) for (const preprocess of state.cmd.config.preprocess) {
			await preprocess(state);
		}
		return await next()
	}
}