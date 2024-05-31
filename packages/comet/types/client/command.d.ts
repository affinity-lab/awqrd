export type Command<Instance extends Object, MethodName extends keyof Instance> = {
    instance: Instance;
    key: MethodName;
    config: Record<string, any>;
    name: string;
    params: string[];
};
