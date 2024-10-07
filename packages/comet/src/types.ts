import {CometResult} from "./comet-result";
import {Cache} from "@affinity-lab/util";
import {CometState} from "./client/comet-state";

export type AuthData = {
	/** User id */
	uid: number | string
	/** Extra data */
	ext: any
	/** Integrity id */
	int: string | number
}
export type AuthToken = {
	/** User id */
	uid: number | string
	/** Extra data */
	ext: any
	/** Original token */
	ori: boolean
}
export type RefreshToken = {
	/** User id */
	uid: number | string
	/** Integrity id */
	int: string | number
	ssi: boolean
}

export interface TokenEncoder {
	/**
	 * Read the token and return the value or undefined if the token does not exist, or false is invalid
	 * @param token
	 */
	readAuthToken(token: string | undefined): AuthToken | undefined | false;
	/**
	 * Read the token and return the value or undefined if the token does not exist, or false is invalid
	 * @param token
	 */
	readRefreshToken(token: string | undefined): RefreshToken | undefined | false;
	/**
	 * Create a token from the value and set the timeout
	 * @param value
	 * @param timeout
	 */
	createAuthToken(value: AuthToken, timeout: number): string;
	/**
	 * Create a token from the value and set the timeout
	 * @param value
	 * @param timeout
	 */
	createRefreshToken(value: RefreshToken, timeout: number): string;
}

export interface TokenHandler {
	/**
	 * Get the auth token value from the request event. Returns undefined if the token does not exist, or false is invalid
	 * @param request
	 */
	getAuthToken(request: any): AuthToken | undefined | false;
	/**
	 * Get the refresh token value from the request event. Returns undefined if the token does not exist, or false is invalid
	 * @param request
	 */
	getRefreshToken(request: any): RefreshToken | undefined | false;
	/**
	 * Set the auth token value
	 * @param result
	 * @param value
	 * @param staySignedIn
	 */
	setAuthToken(result: CometResult, value: AuthToken, staySignedIn?:boolean): void;
	/**
	 * Set the refresh token value
	 * @param result
	 * @param value
	 * @param staySignedIn
	 */
	setRefreshToken(result: CometResult, value: RefreshToken, staySignedIn?:boolean): void;
	/**
	 * Delete the auth token
	 * @param result
	 */
	deleteAuthToken(result: CometResult): void;
	/**
	 * Delete the refresh token
	 * @param result
	 */
	deleteRefreshToken(result: CometResult): void;
}

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