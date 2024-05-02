import { ClassMetaData } from "@affinity-lab/awqrd-util/class-meta-data.ts";
import { Client } from "./client/client.ts";
type CometGroupConfig = {
    name?: string;
    clients?: Client[];
} & Record<string, any>;
export type CometCommandConfig = {
    name?: string;
    clients?: Client[];
} & Record<string, any>;
export declare class Comet {
    static readonly classMetaData: ClassMetaData;
    static Args(target: any, propertyKey: string, index: number): void;
    static Files(target: any, propertyKey: string, index: number): void;
    static Env(target: any, propertyKey: string, index: number): void;
    static Client(target: any, propertyKey: string, index: number): void;
    static Ctx(target: any, propertyKey: string, index: number): void;
    static Command(config?: CometCommandConfig): (target: any, propertyKey: string) => void;
    static Group(config?: CometGroupConfig): (target: any) => void;
}
export {};
