import { MySqlTable } from "drizzle-orm/mysql-core";
import type { MySql2Database } from "drizzle-orm/mysql2";
import type { Cache } from "@affinity-lab/util";
import type { IEntityRepository } from "../../entity-repository-interface";
import { Collection } from "./collection";
import type { AttachmentObjects, ITmpFile } from "./helper/types";
export declare class Storage {
    readonly path: string;
    readonly db: MySql2Database<any>;
    readonly schema: MySqlTable;
    readonly cache?: Cache<any> | undefined;
    readonly cleanup?: ((name: string, id: number, file: string) => Promise<void>) | undefined;
    constructor(path: string, db: MySql2Database<any>, schema: MySqlTable, cache?: Cache<any> | undefined, cleanup?: ((name: string, id: number, file: string) => Promise<void>) | undefined);
    collections: Record<string, Collection<any>>;
    addCollection(collection: any): void;
    getGroupDefinition(name: string, entityRepository: IEntityRepository): {
        storage: Storage;
        group: string;
        entityRepository: IEntityRepository;
    };
    private get stmt_get();
    private get stmt_all();
    private get stmt_del();
    protected getPath(name: string, id: number): string;
    protected getCacheKey(name: string, id: number): string;
    get(name: string, id: number, res?: {
        found?: "db" | "cache" | false;
    }): Promise<AttachmentObjects>;
    protected getIndexOfAttachments(name: string, id: number, filename: string, fail?: boolean): Promise<{
        attachments: AttachmentObjects;
        index: number;
    }>;
    destroy(repository: IEntityRepository, id: number): Promise<void>;
    protected destroyFiles(name: string, id: number): Promise<void>;
    protected updateRecord(name: string, id: number, attachments: AttachmentObjects): Promise<void>;
    add(name: string, id: number, file: ITmpFile, metadata: Record<string, any>): Promise<void>;
    delete(name: string, id: number, filename: string): Promise<void>;
    setPosition(name: string, id: number, filename: string, position: number): Promise<void>;
    updateMetadata(name: string, id: number, filename: string, metadata: Record<string, any>): Promise<void>;
    rename(name: string, id: number, filename: string, newName: string): Promise<void>;
}
