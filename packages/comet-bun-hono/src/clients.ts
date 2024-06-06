import {Client, Clients as CometClients} from "@affinity-lab/comet";
import {Context} from "hono";

export class Clients<GROUPS extends string = string> extends CometClients<GROUPS> {
	async get(ctx: Context): Promise<Client<Context>> {
		let name: string | undefined = this.#getClient(ctx);
		let version: string | undefined = this.#getVersion(ctx);
		let apiKey: string | undefined = this.#getApiKey(ctx);
		return await this.find(name, version, apiKey);
	}

	#getClient = (ctx: Context) => {return ctx.req.header("client")}
	#getApiKey = (ctx: Context) => {return ctx.req.header("client-api-key")}
	#getVersion = (ctx: Context) => {return ctx.req.header("client-version")}

	set getClient(fn: (ctx: Context) => string | undefined) {this.#getClient = fn}
	set getApiKey(fn: (ctx: Context) => string | undefined) {this.#getApiKey = fn}
	set getVersion(fn: (ctx: Context) => string | undefined) {this.#getVersion = fn}
}
