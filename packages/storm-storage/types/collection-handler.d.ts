import type { WithIdOptional } from "@affinity-lab/storm";
import type { Attachment } from "./attachment";
import { Collection } from "./collection";
import type { ITmpFile } from "./helper/types";
import type { Storage } from "./storage";
export declare class CollectionHandler<METADATA extends Record<string, any>> extends Array<Attachment<METADATA>> {
    #private;
    protected loaded: boolean;
    /**
     * Get the entity owning the collection
     */
    get entity(): WithIdOptional<Record<string, any>>;
    /**
     * Get the id of the entity owning the collection
     */
    get id(): number;
    /**
     * Get the collection
     */
    get collection(): Collection<METADATA>;
    /**
     * Get the storage of the collection
     */
    get storage(): Storage;
    constructor(collection: Collection<METADATA>, entity: WithIdOptional<Record<string, any>>);
    push(...args: any[]): never;
    unshift(...args: any[]): never;
    pop(): never;
    shift(): never;
    /**
     * Load the collection
     */
    load(): Promise<this>;
    /**
     * Add a file to the collection
     * @param file
     */
    add(file: ITmpFile): Promise<void>;
    toJSON(): {
        collection: string;
        id: number;
        files: Attachment<METADATA>[] | null;
    };
    /**
     * Get the first file in the collection
     */
    first(): Attachment<METADATA> | undefined;
    /**
     * Get the last file in the collection
     */
    last(): Attachment<METADATA> | undefined;
    /**
     * Get a file by name
     * @param filename
     */
    findFile(filename: string): Attachment<METADATA> | undefined;
    /**
     * Get files by a glob pattern
     * @param glob
     */
    findFiles(glob: string): Array<Attachment<METADATA>>;
}
