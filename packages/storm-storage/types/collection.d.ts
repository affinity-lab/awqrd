import { EntityRepositoryInterface } from "@affinity-lab/storm";
import type { WithIdOptional } from "@affinity-lab/storm";
import { Attachment } from "./attachment";
import { CollectionHandler } from "./collection-handler";
import type { CollectionOptions, ITmpFile, MetaField, Rules } from "./helper/types";
import type { Storage } from "./storage";
export declare abstract class Collection<METADATA extends Record<string, any> = {}> {
    readonly name: string;
    readonly groupDefinition: {
        storage: Storage;
        group: string;
        entityRepository: EntityRepositoryInterface;
    };
    readonly entityRepository: EntityRepositoryInterface;
    readonly group: string;
    private readonly _storage;
    /**
     * The storage of the collection
     */
    get storage(): Storage;
    /**
     * The writable metadata fields
     */
    readonly writableMetaFields: Record<string, MetaField>;
    /**
     * The rules for the collection
     */
    readonly rules: Rules;
    constructor(name: string, groupDefinition: {
        storage: Storage;
        group: string;
        entityRepository: EntityRepositoryInterface;
    }, rules: CollectionOptions);
    /**
     * Get a collection handler
     * @param entity
     */
    handler(entity: WithIdOptional<Record<string, any>>): CollectionHandler<METADATA> | undefined;
    protected updateMetadata(id: number, filename: string, metadata: Partial<METADATA>): Promise<void>;
    protected prepareFile(file: ITmpFile): Promise<{
        file: ITmpFile;
        metadata: Record<string, any>;
    }>;
    /**
     * Prepare the file for storage
     * @param collectionHandler
     * @param file
     */
    prepare(collectionHandler: CollectionHandler<METADATA>, file: ITmpFile): Promise<{
        file: ITmpFile;
        metadata: Record<string, any>;
    }>;
    /**
     * Hook for when an attachment is removed
     */
    onDelete(): Promise<void>;
    /**
     * Hook for when an attachment is modified
     */
    onModify(): Promise<void>;
    /**
     * Get attachments for an entity
     * @param id
     */
    get(id: number): Promise<Array<Attachment<METADATA>>>;
}
