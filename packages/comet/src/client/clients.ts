import {MaterializeIt, type MetaDataStore, Middleware, MiddlewareFn, omitFields} from "@affinity-lab/util";
import {Comet} from "../comet";
import {cometError} from "../error";
import {Client} from "./client";
import {ClientGroup} from "./client-group";

export abstract class Clients<GROUPS extends string = string> {
	constructor(readonly clients: Record<GROUPS, ClientGroup>) {}

	public describe() {
		for (let group in this.clients) {
			for (let client of this.clients[group].all()) {
				console.log(`${group}: ${client.version}`);
				for (let command in client.commands) {
					console.log("\t- ", command, client.commands[command].instance.constructor.name, client.commands[command].key);
				}
			}
		}
	}

	public group(name: GROUPS): ClientGroup | undefined { return this.clients[name];}

	public client(name: GROUPS, version: number | [number, number]): Array<Client> {
		let group = this.group(name);
		if (!group) return [];
		if (typeof version === "number") {
			let client = group.get(version);
			return client ? [client] : [];
		} else return group.range(version[0], version[1]);
	}

	protected async find(name: string | undefined, version: number | string | undefined, apiKey: string | undefined): Promise<Client> {

		if (name === undefined) throw cometError.client.noInfo()
		if (version === undefined) throw cometError.client.noInfo()
		if (typeof version === "string") version = parseInt(version);

		let group = this.group(name as GROUPS)
		if (!group) throw cometError.client.notFound(name, version);
		let client = group?.get(version)
		if (!client) throw cometError.client.notFound(name, version);
		if (client.unsupported) throw cometError.client.unsupported();
		let apiKeyAccepted = await client.authApi(apiKey);
		if (!apiKeyAccepted) throw cometError.client.notAllowed(name, version);

		return client;
	}

	readCommands() {

		let allClients: Array<Client> = [];
		for (const key in this.clients) allClients.push(...this.clients[key].all());

		Comet.classMetaData.stores.forEach((store: MetaDataStore) => {
			let config = Comet.classMetaData.read(store.target, {flatten: false, simple: true});

			if (config === undefined) throw Error("Config not found for " + store.target.name + ". Did you forget to add the @Comet decorator?");
			let group = config["group"];
			if (group) {
				let cometInstance = new (store.target as new () => any)(); // TODO typehint

				for (const key in config["command"]) {
					let name = ((group["name"] || store.target.name) + "." + (config["command"][key]["name"] || key)).toLowerCase();
					let clients = config["command"][key]["clients"] || group["clients"] || allClients;

					let params: string[] = [];
					if (config["params"] !== undefined) {
						for (const param in config["params"][key]) {
							params[parseInt(param)] = config["params"][key][param];
						}
					}

					clients.forEach((client: Client) => {
						config!["command"][key] = omitFields(config!["command"][key], "name", "clients")
						client.add(name, cometInstance, key, config!["command"][key], params)
					});
				}
			}
		})
	}

	abstract get(ctx: any): Promise<Client<any>>;
}

export class SingleClient extends Clients {
	constructor(middlewares: Array<MiddlewareFn | Middleware> | undefined = undefined, protected name: string = "default") {
		let clients: Record<string, any> = {};
		clients[name] = new ClientGroup(new (class extends Client {})(1, middlewares))
		super(clients);
	}
	get(): Promise<Client> { return Promise.resolve(this.clients[this.name].get(1)!);}

	@MaterializeIt get instance() { return this.clients[this.name].get(1)!;}
}
