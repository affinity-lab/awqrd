export type Command<Instance extends Object, MethodName extends keyof Instance> = {
	instance: Instance, // The object that contains the method to be executed
	key: MethodName, // The name of the method to be executed on the instance
	config: Record<string, any> // Configuration options for the method execution
	name: string // The name of the command
	params: string[] // The names of the parameters that the method accepts
}