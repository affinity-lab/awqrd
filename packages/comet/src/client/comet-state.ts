import {Client} from "./client";
import {Command} from "./command";

export type CometState<CTX = any> = {
	args: Record<string, any>
	params: Record<string, string>
	env: { [key: symbol | string]: any }
	files: Record<string, Array<File>>
	id: string
	ctx: CTX
	cmd: Command<any, any>
	client: Client
	headers: Record<string, string>
	cookies: Record<string, string>
}