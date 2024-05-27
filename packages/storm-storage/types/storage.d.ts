import { EntityRepositoryInterface } from "@affinity-lab/storm";
import type { Cache } from "@affinity-lab/util";
import { MySqlTable } from "drizzle-orm/mysql-core";
import type { MySql2Database } from "drizzle-orm/mysql2";
import { Collection } from "./collection";
import type { AttachmentObjects, ITmpFile } from "./helper/types";
export type GroupDefinition = {
    storage: Storage;
    group: string;
    entityRepository: EntityRepositoryInterface;
};
type Collections = Record<string, Collection>;
export declare class Storage {
    readonly path: string;
    readonly db: MySql2Database<any>;
    readonly schema: MySqlTable;
    readonly cache?: Cache<any> | undefined;
    readonly cleanup?: ((name: string, id: number, file: string) => Promise<void>) | undefined;
    constructor(path: string, db: MySql2Database<any>, schema: MySqlTable, cache?: Cache<any> | undefined, cleanup?: ((name: string, id: number, file: string) => Promise<void>) | undefined);
    collections: Collections;
    groups: Record<string, {
        collections: Collections;
        repository: EntityRepositoryInterface;
    }>;
    /**
     * Add a collection to the storage
     * @param collection
     */
    addCollection(collection: any): void;
    /**
     * Get a collection from the storage
     * @param name
     * @param entityRepository
     */
    getGroupDefinition(name: string, entityRepository: EntityRepositoryInterface): GroupDefinition;
    private get stmt_get();
    private get stmt_all();
    private get stmt_del();
    protected getPath(name: string, id: number): string;
    protected getCacheKey(name: string, id: number): string;
    /**
     * Get all attachments for a given name and id
     * @param name
     * @param id
     * @param res
     */
    get(name: string, id: number, res?: {
        found?: "db" | "cache" | false;
    }): Promise<AttachmentObjects>;
    protected getIndexOfAttachments(name: string, id: number, filename: string, fail?: boolean): Promise<{
        attachments: AttachmentObjects;
        index: number;
    }>;
    /**
     * Delete all attachments for a given id
     * @param repository
     * @param id
     */
    destroy(repository: EntityRepositoryInterface, id: number): Promise<void>;
    protected destroyFiles(name: string, id: number): Promise<void>;
    protected updateRecord(name: string, id: number, attachments: AttachmentObjects): Promise<void>;
    /**
     * Add an attachment to the storage
     * @param name
     * @param id
     * @param file
     * @param metadata
     */
    add(name: string, id: number, file: ITmpFile, metadata: Record<string, any>): Promise<void>;
    /**
     * Delete an attachment from the storage
     * @param name
     * @param id
     * @param filename
     */
    delete(name: string, id: number, filename: string): Promise<void>;
    /**
     * Set the position of an attachment
     * @param name
     * @param id
     * @param filename
     * @param position
     */
    setPosition(name: string, id: number, filename: string, position: number): Promise<void>;
    /**
     * Update the metadata of an attachment
     * @param name
     * @param id
     * @param filename
     * @param metadata
     */
    updateMetadata(name: string, id: number, filename: string, metadata: Record<string, any>): Promise<void>;
    /**
     * Rename an attachment
     * @param name
     * @param id
     * @param filename
     * @param newName
     */
    rename(name: string, id: number, filename: string, newName: string): Promise<void>;
    plugin(): (repository: EntityRepositoryInterface) => void;
}
export {};
