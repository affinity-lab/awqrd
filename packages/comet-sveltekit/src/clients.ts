import {Client, Clients as CometClients} from "@affinity-lab/comet";
import {RequestEvent} from "@sveltejs/kit";

export class Clients<GROUPS extends string = string> extends CometClients<GROUPS> {
	async get(ctx: RequestEvent): Promise<Client<RequestEvent>> {
		let name: string | undefined = this.#getClient(ctx);
		let version: string | undefined = this.#getVersion(ctx);
		let apiKey: string | undefined = this.#getApiKey(ctx);
		return await this.find(name, version, apiKey);
	}

	#getClient = (ctx: RequestEvent) => {return ctx.request.headers.get("client") ?? undefined}
	#getApiKey = (ctx: RequestEvent) => {return ctx.request.headers.get("client-api-key") ?? undefined}
	#getVersion = (ctx: RequestEvent) => {return ctx.request.headers.get("client-version") ?? undefined}

	set getClient(fn: (ctx: RequestEvent) => string | undefined) {this.#getClient = fn}
	set getApiKey(fn: (ctx: RequestEvent) => string | undefined) {this.#getApiKey = fn}
	set getVersion(fn: (ctx: RequestEvent) => string | undefined) {this.#getVersion = fn}
}
