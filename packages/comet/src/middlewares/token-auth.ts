import {AuthData, TokenHandler} from "../auth/types";
import {TokenAuthMiddleware} from "../auth/token-auth-middleware";

export function tokenAuthMiddleware(tokenHandler: TokenHandler, authResolver: (uid: number | string) => Promise<AuthData | undefined>,) {
	return new TokenAuthMiddleware(tokenHandler, authResolver);
}
