import {CometResult} from "./comet-result";
import {Cache} from "@affinity-lab/util";
import {CometState} from "./client/comet-state";

export type CacheMiddlewareOptions = {
	cache: Cache,
	defaultTtl?: number,
	defaultKeyFn?: (state: CometState) => string | Record<string, any>,
	keyHashAlgorithm?: string,
	keySalt?: string
}


export type ParseRequestOptions = {
	headers?: Array<string>
	cookies?: Array<string>
}

export type CometLogger<REQ> = {
	requestLog?: (state: CometState<REQ>) => void,
	resultLog?: (state: CometState<REQ>, response: CometResult) => void,
	errorLog?: (state: CometState<REQ>, error: any) => void
}

export type ErrorHandler = (error: any) => Promise<CometResult | null>;