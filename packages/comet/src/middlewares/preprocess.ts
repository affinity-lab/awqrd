import type {Middleware} from "@affinity-lab/util";
import type {CometState} from "../client/client";

export class PreprocessMiddleware implements Middleware {
	async handle(state: CometState, next: Function) {
		if (typeof state.cmd.config.preprocess === "function") await state.cmd.config.preprocess(state);
		if (Array.isArray(state.cmd.config.preprocess)) for (const preprocess of state.cmd.config.preprocess) {
			await preprocess(state);
		}
		return await next()
	}
}