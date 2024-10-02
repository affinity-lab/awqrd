import crypto from "crypto";
import {CometState} from "../client/comet-state";
import {CometResult} from "../comet-result";
import {CacheMiddlewareOptions} from "../types";

export function cacheMiddleware(options: CacheMiddlewareOptions) {
	return async function (state: CometState, next: () => Promise<CometResult>) {
		if (!state.cmd.config.cache) return await next();
		let key = (state.cmd.config.cache.key === undefined) ? (options.defaultKeyFn || {id: state.id, args: state.args, env: state.env}) : state.cmd.config.cache.key(state);
		if (typeof key !== "string") key = crypto.createHash(options.keyHashAlgorithm || "md5").update(JSON.stringify(key) + options.keySalt || "").digest("hex");

		let cached = await options.cache.get(key);
		if (cached) {
			return cached
		}
		let value = await next();
		await options.cache.set({key, value}, state.cmd.config.cache.ttl ?? (options.defaultTtl || 60));
		return value;
	}
}