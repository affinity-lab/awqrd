import {Jwt, Middleware, MiddlewareFn} from "@affinity-lab/util";
import {cometError} from "../error";
import {Client} from "./client";
import {CometState} from "./comet-state";


export class ClientWithJwt<T = any> extends Client {
	private $jwt: Jwt<T>;
	constructor(version: number, middlewares?: Array<MiddlewareFn | Middleware>, private jwtData?: {secret?: string, expires?: string}, unsupported?: boolean) {
		super(version, middlewares, unsupported);
		this.jwtData = {secret: jwtData?.secret || "SECRET", expires: jwtData?.expires || "1h"};
		this.$jwt = new Jwt(this.jwtData.secret!, this.jwtData.expires);
	}

	decode(state: CometState): T | undefined {
		let token = state.ctx.req.header("Authorization") || state.ctx.req.header("authorization");
		if(token?.startsWith("Bearer ")) token = token?.slice(7);
		if(token === undefined) cometError.unauthorized();
		try{
			return this.$jwt.decode(token);
		} catch (e) {
			throw cometError.unauthorized();
		}
	}

	encode(payload: T, expires?: string) {
		return this.$jwt.encode(payload, expires || this.jwtData!.expires);
	}

	async authApi(apiKey: string | undefined): Promise<boolean> {
		return false;
	}

}