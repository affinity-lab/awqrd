import type { IEntity } from "../../types";
import type { Attachment } from "./attachment";
import { Collection } from "./collection";
import type { ITmpFile } from "./helper/types";
import type { Storage } from "./storage";
export declare class CollectionHandler<METADATA extends Record<string, any>> extends Array<Attachment<METADATA>> {
    #private;
    protected loaded: boolean;
    get entity(): IEntity;
    get id(): number;
    get collection(): Collection<METADATA>;
    get storage(): Storage;
    constructor(collection: Collection<METADATA>, entity: IEntity);
    push(...args: any[]): never;
    unshift(...args: any[]): never;
    pop(): never;
    shift(): never;
    load(): Promise<this>;
    add(file: ITmpFile): Promise<void>;
    toJSON(): {
        collection: string;
        id: number;
        files: Attachment<METADATA>[] | null;
    };
    first(): Attachment<METADATA> | undefined;
    last(): Attachment<METADATA> | undefined;
    findFile(filename: string): Attachment<METADATA> | undefined;
    findFiles(glob: string): Array<Attachment<METADATA>>;
}
