import { type MaybePromise, type MaybeUndefined, type MaybeUnset, ProcessPipeline, T_Class } from "@affinity-lab/util";
import { MySqlTableWithColumns } from "drizzle-orm/mysql-core";
import type { MySql2Database } from "drizzle-orm/mysql2";
import type { Dto } from "../types";
import { ViewEntity } from "./view-entity";
import { ViewEntityRepositoryInterface } from "./view-entity-repository-interface";
/**
 * A generic repository class for handling Read operations for storm entity in a MySQL database view.
 * @template SCHEMA - The type of the database schema representing the entity's view.
 * @template ITEM - The type of the entity class.
 */
export declare class ViewEntityRepository<SCHEMA extends MySqlTableWithColumns<any>, ITEM extends ViewEntity, ENTITY extends T_Class<ITEM, typeof ViewEntity> = T_Class<ITEM, typeof ViewEntity>, DTO extends Dto<SCHEMA> = Dto<SCHEMA>> implements ViewEntityRepositoryInterface<SCHEMA, ITEM, ENTITY, DTO> {
    readonly db: MySql2Database<any>;
    readonly schema: SCHEMA;
    readonly entity: ENTITY;
    readonly fields: string[];
    readonly pipelines: {
        getOne: ProcessPipeline<"prepare" | "action" | "finalize">;
        getArray: ProcessPipeline<"prepare" | "action" | "finalize">;
        getAll: ProcessPipeline<"prepare" | "action" | "finalize">;
    };
    readonly instantiate: {
        /**
         * Instantiates multiple items from an array of DTOs.
         * @param dtoSet
         * @returns An array of instantiated items.
         */
        all: (dtoSet: Array<DTO>) => Promise<Array<ITEM>>;
        /**
         * Instantiates the first item from an array of DTOs.
         * @param dtoSet
         * @returns The instantiated item, or undefined if the array is blank.
         */
        first: (dtoSet: Array<DTO>) => Promise<MaybeUndefined<ITEM>>;
        /**
         * Instantiates an item from a DTO.
         * @param dto
         * @returns The instantiated item, or undefined if the DTO is undefined.
         */
        one: (dto: DTO | undefined) => Promise<ITEM | undefined>;
    };
    protected readonly exec: {
        getOne: (id: number) => Promise<any>;
        getArray: (ids: Array<number>) => Promise<any>;
        getAll: () => Promise<any>;
    };
    constructor(db: MySql2Database<any>, schema: SCHEMA, entity: ENTITY);
    addPlugin(plugin: (repository: ViewEntityRepositoryInterface) => any): this;
    protected initialize(): void;
    protected get stmt_all(): (args: undefined) => Promise<DTO[]>;
    protected get stmt_get_array(): (args: {
        ids: number[];
    }) => Promise<DTO[]>;
    protected get stmt_get(): (args: {
        id: number;
    }) => Promise<MaybeUndefined<DTO>>;
    protected pipelineFactory(): {
        getOne: ProcessPipeline<"prepare" | "action" | "finalize">;
        getArray: ProcessPipeline<"prepare" | "action" | "finalize">;
        getAll: ProcessPipeline<"prepare" | "action" | "finalize">;
    };
    protected pipelineExecFactory(): {
        getOne: (id: number) => Promise<any>;
        getArray: (ids: Array<number>) => Promise<any>;
        getAll: () => Promise<any>;
    };
    protected instantiateFactory(): {
        /**
         * Instantiates multiple items from an array of DTOs.
         * @param dtoSet
         * @returns An array of instantiated items.
         */
        all: (dtoSet: Array<DTO>) => Promise<Array<ITEM>>;
        /**
         * Instantiates the first item from an array of DTOs.
         * @param dtoSet
         * @returns The instantiated item, or undefined if the array is blank.
         */
        first: (dtoSet: Array<DTO>) => Promise<MaybeUndefined<ITEM>>;
        /**
         * Instantiates an item from a DTO.
         * @param dto
         * @returns The instantiated item, or undefined if the DTO is undefined.
         */
        one: (dto: DTO | undefined) => Promise<ITEM | undefined>;
    };
    /**
     * Prepares the item DTO. This is a hook method intended for subclass overrides.
     * @param dto The DTO to prepare.
     */
    protected transformItemDTO(dto: DTO): MaybePromise<void>;
    /**
     * Applies the DTO to the item.
     * @param item The item to apply the DTO to.
     * @param dto The data transfer object (DTO) containing the data to be applied to the item.
     */
    protected applyItemDTO(item: ITEM, dto: DTO): Promise<void>;
    /**
     * Retrieves the raw data of an entity by its ID.
     * @param id - The ID of the entity.
     * @returns A promise resolving to the raw data of the entity, or undefined if not found.
     */
    getRawDTO(id: MaybeUnset<number>): Promise<MaybeUndefined<DTO>>;
    /**
     * Retrieves all items
     * @returns A promise resolving to all items.
     */
    get(): Promise<Array<ITEM>>;
    /**
     * Retrieves one or multiple items by their IDs.
     * @param ids
     * @returns A promise resolving to one or multiple items, or undefined if not found.
     */
    get(ids: Array<number>): Promise<Array<ITEM>>;
    /**
     * Retrieves one item by the provided ID.
     * @param id
     * @returns A promise resolving to the item, or undefined if not found.
     */
    get(id: MaybeUnset<number>): Promise<ITEM | undefined>;
    /**
     * Creates a new item.
     * @param importData - initial data to import into the new item.
     * @returns A promise that resolves to the new item.
     */
    create(): Promise<ITEM>;
    /**
     * Reloads an item from the database.
     * @param item - The item to reload.
     * @returns A promise that resolves once the item has been reloaded.
     */
    reload(item: ITEM): Promise<void>;
}
