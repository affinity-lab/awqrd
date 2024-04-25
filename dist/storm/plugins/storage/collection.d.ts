import type { IEntityRepository } from "../../entity-repository-interface.ts";
import type { IEntity } from "../../types.ts";
import { Attachment } from "./attachment.ts";
import { CollectionHandler } from "./collection-handler.ts";
import type { CollectionOptions, MetaField, Rules, ITmpFile } from "./helper/types.ts";
import type { Storage } from "./storage.ts";
export declare abstract class Collection<METADATA extends Record<string, any> = {}> {
    readonly name: string;
    readonly groupDefinition: {
        storage: Storage;
        group: string;
        entityRepository: IEntityRepository;
    };
    private readonly _storage;
    get storage(): Storage;
    readonly writableMetaFields: Record<string, MetaField>;
    readonly rules: Rules;
    private entityRepository;
    private readonly group;
    constructor(name: string, groupDefinition: {
        storage: Storage;
        group: string;
        entityRepository: IEntityRepository;
    }, rules: CollectionOptions);
    handler(entity: IEntity): CollectionHandler<METADATA> | undefined;
    protected updateMetadata(id: number, filename: string, metadata: Partial<METADATA>): Promise<void>;
    protected prepareFile(file: ITmpFile): Promise<{
        file: ITmpFile;
        metadata: Record<string, any>;
    }>;
    prepare(collectionHandler: CollectionHandler<METADATA>, file: ITmpFile): Promise<{
        file: ITmpFile;
        metadata: Record<string, any>;
    }>;
    onDelete(): Promise<void>;
    onModify(): Promise<void>;
    get(id: number): Promise<Array<Attachment<METADATA>>>;
}
