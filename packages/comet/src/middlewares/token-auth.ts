// import type {CometResult, CometState} from "@affinity-lab/comet";
// import {type Middleware} from "@affinity-lab/util";
// import type {RequestEvent} from "@sveltejs/kit";
//
// export function tokenAuthMiddleware(tokenHandler: TokenHandler, authResolver: (uid: number | string) => Promise<AuthData | undefined>,) {
// 	return new TokenAuthMiddleware(tokenHandler, authResolver);
// }
//
// export class TokenAuthMiddleware implements Middleware {
//
// 	constructor(
// 		protected tokenHandler: TokenHandler,
// 		protected authResolver: (uid: number | string) => Promise<AuthData | undefined>,
// 	) {}
//
// 	async handle(state: CometState<RequestEvent>, next: Function): Promise<CometResult> {
// 		let authState = await this.createAuthState(state.ctx);
// 		setAuthState(state.env, authState);
// 		let result: CometResult = await next();
//
// 		if (authState.isRefreshRequested() && authState.isRefreshable()) {
// 			let staySignedIn = authState.staySignedIn;
// 			this.tokenHandler.setAuthToken(result, {uid: authState.auth!.uid, ext: authState.auth!.ext, ori: false}, staySignedIn);
// 			this.tokenHandler.setRefreshToken(result, {uid: authState.auth!.uid, int: authState.int!, ssi: staySignedIn}, staySignedIn);
// 		} else if (authState.needCleanup()) {
// 			this.tokenHandler.deleteAuthToken(result);
// 			this.tokenHandler.deleteRefreshToken(result);
// 		} else if (authState.hasSignInEvent()) {
// 			let auth = authState.getSignInEvent().authData;
// 			let staySignedIn = authState.getSignInEvent().staySignedIn;
// 			this.tokenHandler.setAuthToken(result, {uid: auth.uid, ext: auth.ext, ori: true}, staySignedIn);
// 			this.tokenHandler.setRefreshToken(result, {uid: auth.uid, int: auth.int, ssi: staySignedIn}, staySignedIn);
// 		}
// 		return result;
// 	}
//
// 	protected async createAuthState(requestEvent: RequestEvent): Promise<AuthState> {
// 		let authToken = this.tokenHandler.getAuthToken(requestEvent);
// 		if (authToken) return new AuthState(authToken);
//
// 		let refreshToken = this.tokenHandler.getRefreshToken(requestEvent);
// 		if (refreshToken) {
// 			let authData = await this.authResolver(refreshToken.uid);
// 			if (authData && refreshToken.int === authData.int) return new AuthState({uid: authData.uid, ext: authData.ext, ori: false}, authData.int, refreshToken.ssi);
// 		}
// 		let authState = new AuthState(undefined);
// 		if (refreshToken === false || authToken === false) authState.hasToken()
// 		return authState;
// 	}
// }
//
// // ----------------------------------------------------------------------------------------
//
