import {Client} from "./client";
import {Command} from "./command";

export type CometState<CTX = any> = {
	args: Record<string, any>
	params: Record<string, string>
	env: Record<string, any>
	files: Record<string, Array<File>>
	id: string
	ctx: CTX
	cmd: Command<any, any>
	client: Client
}