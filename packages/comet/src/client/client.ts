import {type Middleware, type MiddlewareFn, Pipeline} from "@affinity-lab/util";
import {CometResult} from "../comet-result";
import {cometError} from "../error";
import {CometState} from "./comet-state";
import {Command} from "./command";

async function cometResultFactoryMiddleware(state: CometState, next: Function): Promise<CometResult> {
	const result = await next()
	return (result instanceof CometResult) ? result : new CometResult(result ?? null);
}

export abstract class Client<CTX = any> {
	#commands: Record<string, Command<any, any>> = {};
	readonly id: string = crypto.randomUUID();
	private pipeline: Pipeline<any, any>;

	reset() {
		this.#commands = {};
	}

	constructor(
		public readonly version: number = 1,
		middlewares: Array<MiddlewareFn | Middleware> = [],
		public readonly unsupported: boolean = false,
	) {
		this.pipeline = new Pipeline(
			...middlewares,
			cometResultFactoryMiddleware,
			this.execute.bind(this)
		);
	}

	get commands() {return this.#commands;}

	async authApi(apiKey: string | undefined): Promise<boolean> {
		return true;
	}

	protected async execute(state: CometState) {

		if (this.unsupported) throw cometError.client.unsupported();

		let args = [];
		if (state.cmd.params.length === 0) args.push(state);
		else for (let param of state.cmd.params) args.push(state[param as keyof CometState])

		return state.cmd.instance[state.cmd.key](...args);
	}

	async resolve(command: string, ctx: CTX): Promise<CometResult> {
		command = command.toLowerCase();
		let cmd = this.#commands[command];
		if(cmd === undefined) throw cometError.notFound(`There is no command named: ${command}`);
		return await this.pipeline.run({ctx, args: {}, params: {}, files: {}, cmd, client: this, env: {}, id: this.id + "." + command});
	}

	add(name: string, instance: any, key: string, config: Record<string, any>, params: string[]) {
		if (this.#commands[name] !== undefined) console.log(`Warning: DUPLICATE COMMAND ${name}`);
		this.#commands[name] = {instance, key, config, name, params};
	}
}