import type {AuthToken, RefreshToken, TokenEncoder} from "../types";
import {Jwt} from "@affinity-lab/util";

export class JwtTokenEncoder implements TokenEncoder {
	private jwt: Jwt<unknown>;

	constructor(key: string) {
		this.jwt = new Jwt(key);
	}
	createAuthToken(value: AuthToken, timeout: number) {return this.jwt.encode(value, timeout);}
	createRefreshToken(value: RefreshToken, timeout: number) {return this.jwt.encode(value, timeout);}
	readAuthToken(token: string | undefined): AuthToken | undefined | false {
		if (token === undefined) return undefined;
		try {
			return this.jwt.decode(token) as AuthToken;
		} catch (e) {
			return false;
		}
	}
	readRefreshToken(token: string | undefined): RefreshToken | undefined | false {
		if (token === undefined) return undefined;
		try {
			return this.jwt.decode(token) as RefreshToken;
		} catch (e) {
			return false;
		}
	}
}
