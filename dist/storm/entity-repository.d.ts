import { MySqlTable } from "drizzle-orm/mysql-core";
import type { MySql2Database } from "drizzle-orm/mysql2";
import { ProcessPipeline } from "../util/process-pipeline.ts";
import type { MaybePromise, MaybeUndefined, MaybeUnset } from "../util/types.ts";
import type { IEntityRepository } from "./entity-repository-interface.ts";
import { Entity } from "./entity.ts";
import type { Dto, EntityInitiator, Item, WithId } from "./types.ts";
/**
 * A generic repository class for handling CRUD operations for storm entity in a MySQL database.
 * @template DB - The type of the database connection.
 * @template SCHEMA - The type of the database schema representing the entity's table.
 * @template ENTITY - The type of the entity class.
 */
export declare class EntityRepository<DB extends MySql2Database<any>, SCHEMA extends MySqlTable, ENTITY extends EntityInitiator<ENTITY, typeof Entity>> implements IEntityRepository {
    readonly db: DB;
    readonly schema: SCHEMA;
    readonly entity: ENTITY;
    readonly fields: string[];
    readonly pipelines: {
        insert: ProcessPipeline<"prepare" | "action" | "finalize">;
        update: ProcessPipeline<"prepare" | "action" | "finalize">;
        getOne: ProcessPipeline<"prepare" | "action" | "finalize">;
        getAll: ProcessPipeline<"prepare" | "action" | "finalize">;
        delete: ProcessPipeline<"prepare" | "action" | "finalize">;
        overwrite: ProcessPipeline<"prepare" | "action" | "finalize">;
    };
    protected exec: {
        delete: (item: Item<ENTITY>) => Promise<Record<string, any>>;
        insert: (item: Item<ENTITY>) => Promise<number>;
        update: (item: Item<ENTITY>) => Promise<Record<string, any>>;
        getOne: (id: number) => Promise<any>;
        getAll: (ids: Array<number>) => Promise<any>;
        overwrite: (item: Item<ENTITY>, values: Record<string, any>, reload?: boolean) => Promise<Record<string, any>>;
    };
    /**
     * Constructs an instance of EntityRepository.
     * @param db - The database connection.
     * @param schema - The database schema representing the entity's table.
     * @param entity - The entity class.
     */
    constructor(db: DB, schema: SCHEMA, entity: ENTITY);
    /**
     * Initializes the object.
     */
    protected initialize(): void;
    /**
     * Instantiates multiple items from an array of DTOs.
     * @param dtoSet - An array of DTOs.
     * @returns An array of instantiated items.
     */
    protected instantiateAll(dtoSet: Array<Record<string, any>>): Promise<Array<Item<ENTITY>>>;
    /**
     * Instantiates the first item from an array of DTOs.
     * @param dtoSet - An array of DTOs.
     * @returns The instantiated item, or undefined if the array is blank.
     */
    protected instantiateFirst(dtoSet: Array<Record<string, any>>): Promise<MaybeUndefined<Item<ENTITY>>>;
    /**
     * Instantiates an item from a DTO.
     * @param dto - The DTO.
     * @returns The instantiated item, or undefined if the DTO is undefined.
     */
    protected instantiate(dto: Dto<SCHEMA> | undefined): Promise<Item<ENTITY> | undefined>;
    instantiators: {
        all: (res: any) => Promise<Item<ENTITY>[]>;
        first: (res: any) => Promise<MaybeUndefined<Item<ENTITY>>>;
    };
    /**
     * Applies the data transfer object (DTO) to the item.
     * @param item The item to apply the DTO to.
     * @param dto The data transfer object (DTO) containing the data to be applied to the item.
     */
    protected applyItemDTO(item: Item<ENTITY>, dto: Dto<SCHEMA>): Promise<void>;
    /**
     * Retrieves the data transfer object (DTO) from the item.
     * @param item The item from which to retrieve the DTO.
     * @returns The DTO representing the item.
     */
    protected extractItemDTO(item: Item<ENTITY>): Dto<SCHEMA>;
    /**
     * Prepares the DTO for saving by filtering and omitting specified fields.
     * @param dto The DTO to prepare for saving.
     */
    protected transformSaveDTO(dto: Dto<SCHEMA>): void;
    /**
     * Prepares the DTO for insertion by filtering and omitting specified fields.
     * @param dto The DTO to prepare for insertion.
     */
    protected transformInsertDTO(dto: Dto<SCHEMA>): MaybePromise<void>;
    /**
     * Prepares the DTO for updating by filtering and omitting specified fields.
     * @param dto The DTO to prepare for updating.
     */
    protected transformUpdateDTO(dto: Dto<SCHEMA>): MaybePromise<void>;
    /**
     * Prepares the item DTO. This is a hook method intended for subclass overrides.
     * @param dto The DTO to prepare.
     */
    protected transformItemDTO(dto: Dto<SCHEMA>): MaybePromise<void>;
    protected get stmt_all(): (args: {
        ids: number[];
    }) => Promise<Dto<SCHEMA>[]>;
    protected get stmt_get(): (args: {
        id: number;
    }) => Promise<MaybeUndefined<Dto<SCHEMA>>>;
    /**
     * Retrieves raw data for an entity by its ID.
     * @param id - The ID of the entity.
     * @returns A promise resolving to the raw data of the entity, or undefined if not found.
     */
    getRaw(id: MaybeUnset<number>): Promise<MaybeUndefined<Dto<SCHEMA>>>;
    /**
     * Retrieves one or multiple items by their IDs.
     * @param id - The ID or array of IDs of the item(s) to retrieve.
     * @returns A promise resolving to one or multiple items, or undefined if not found.
     * @final
     */
    get(id: Array<number>): Promise<Array<WithId<Item<ENTITY>>>>;
    get(ids: MaybeUnset<number>): Promise<WithId<Item<ENTITY>> | undefined>;
    /**
     * Saves an item by either updating it if it already exists or inserting it if it's new.
     * @param item - The item to save.
     * @returns A promise that resolves once the save operation is completed.
     */
    save(item: Item<ENTITY>): Promise<number | Record<string, any>>;
    /**
     * Updates an existing item.
     * @param item - The item to update.
     * @returns A promise that resolves once the update operation is completed.
     */
    update(item: Item<ENTITY>): Promise<Record<string, any>>;
    /**
     * Inserts a new item.
     * @param item - The item to insert.
     * @returns A promise that resolves once the insert operation is completed.
     */
    insert(item: Item<ENTITY>): Promise<number>;
    /**
     * Overwrites an item with new values.
     * @param item - The item to overwrite.
     * @param values - The new values to overwrite the item with.
     * @param [reload=true] - Whether to reload the item after overwriting.
     * @returns A promise that resolves once the overwrite operation is completed.
     */
    overwrite(item: Item<ENTITY>, values: Record<string, any>, reload?: boolean): Promise<Record<string, any>>;
    /**
     * Deletes an item.
     * @param item - The item to delete.
     * @returns A promise that resolves once the delete operation is completed.
     */
    delete(item: Item<ENTITY>): Promise<Record<string, any>>;
    delete(id: number | undefined | null): Promise<Record<string, any>>;
    /**
     * Creates a blank entity item.
     * @returns The created item.
     */
    create(): Promise<Item<ENTITY>>;
    /**
     * Reloads the item by fetching the raw data for the item's ID and applying it.
     * @param item - The item to reload.
     * @returns A promise that resolves when the item is reloaded.
     */
    reload(item: Item<ENTITY>): Promise<void>;
}
