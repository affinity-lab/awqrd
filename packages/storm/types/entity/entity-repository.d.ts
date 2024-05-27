import type { MaybePromise, T_Class } from "@affinity-lab/util";
import { ProcessPipeline } from "@affinity-lab/util";
import { MySqlTableWithColumns } from "drizzle-orm/mysql-core";
import type { MySql2Database } from "drizzle-orm/mysql2";
import type { Dto } from "../types";
import { Entity } from "./entity";
import type { EntityRepositoryInterface } from "./entity-repository-interface";
import { ViewEntityRepository } from "./view-entity-repository";
/**
 * A generic repository class for handling CRUD operations for storm entity in a MySQL database.
 * @template SCHEMA - The type of the database schema representing the entity's table.
 * @template ITEM - The type of the entity class.
 **/
export declare class EntityRepository<SCHEMA extends MySqlTableWithColumns<any>, ITEM extends Entity, ENTITY extends T_Class<ITEM, typeof Entity> = T_Class<ITEM, typeof Entity>, DTO extends Dto<SCHEMA> = Dto<SCHEMA>> extends ViewEntityRepository<SCHEMA, ITEM, ENTITY, DTO> implements EntityRepositoryInterface<SCHEMA, ITEM, ENTITY, DTO> {
    protected pipelineFactory(): {
        insert: ProcessPipeline<"prepare" | "action" | "finalize">;
        update: ProcessPipeline<"prepare" | "action" | "finalize">;
        delete: ProcessPipeline<"prepare" | "action" | "finalize">;
        overwrite: ProcessPipeline<"prepare" | "action" | "finalize">;
        getOne: ProcessPipeline<"prepare" | "action" | "finalize">;
        getArray: ProcessPipeline<"prepare" | "action" | "finalize">;
        getAll: ProcessPipeline<"prepare" | "action" | "finalize">;
    };
    protected pipelineExecFactory(): {
        delete: (item: ITEM) => Promise<Record<string, any>>;
        insert: (item: ITEM) => Promise<number>;
        update: (item: ITEM) => Promise<Record<string, any>>;
        overwrite: (item: ITEM, values: Record<string, any>, reload?: boolean) => Promise<Record<string, any>>;
        getOne: (id: number) => Promise<any>;
        getArray: (ids: number[]) => Promise<any>;
        getAll: () => Promise<any>;
    };
    readonly pipelines: {
        insert: ProcessPipeline<"prepare" | "action" | "finalize">;
        update: ProcessPipeline<"prepare" | "action" | "finalize">;
        delete: ProcessPipeline<"prepare" | "action" | "finalize">;
        overwrite: ProcessPipeline<"prepare" | "action" | "finalize">;
        getOne: ProcessPipeline<"prepare" | "action" | "finalize">;
        getArray: ProcessPipeline<"prepare" | "action" | "finalize">;
        getAll: ProcessPipeline<"prepare" | "action" | "finalize">;
    };
    protected readonly exec: {
        delete: (item: ITEM) => Promise<Record<string, any>>;
        insert: (item: ITEM) => Promise<number>;
        update: (item: ITEM) => Promise<Record<string, any>>;
        overwrite: (item: ITEM, values: Record<string, any>, reload?: boolean) => Promise<Record<string, any>>;
        getOne: (id: number) => Promise<any>;
        getArray: (ids: number[]) => Promise<any>;
        getAll: () => Promise<any>;
    };
    constructor(db: MySql2Database<any>, schema: SCHEMA, entity: ENTITY);
    addPlugin(plugin: (repository: EntityRepositoryInterface) => any): this;
    /**
     * Retrieves the data transfer object (DTO) from the item.
     * @param item The item from which to retrieve the DTO.
     * @returns The DTO representing the item.
     */
    protected extractItemDTO(item: ITEM): DTO;
    protected getInsertDTO(item: ITEM): Promise<DTO>;
    protected getUpdateDTO(item: ITEM): Promise<DTO>;
    /**
     * Prepares the DTO for saving by filtering and omitting specified fields.
     * @param dto The DTO to prepare for saving.
     */
    protected transformSaveDTO(dto: DTO): MaybePromise<void>;
    /**
     * Prepares the DTO for insertion by filtering and omitting specified fields.
     * @param dto The DTO to prepare for insertion.
     */
    protected transformInsertDTO(dto: DTO): MaybePromise<void>;
    /**
     * Prepares the DTO for updating by filtering and omitting specified fields.
     * @param dto The DTO to prepare for updating.
     */
    protected transformUpdateDTO(dto: DTO): MaybePromise<void>;
    /**
     * Creates a new item.
     * @param importData - initial data to import into the new item.
     * @returns A promise that resolves to the new item.
     */
    create(importData?: Record<string, any>): Promise<ITEM>;
    /**
     * Saves an item by either updating it if it already exists or inserting it if it's new.
     * @param item - The item to save.
     * @returns A promise that resolves once the save operation is completed.
     */
    save(item: ITEM | undefined): Promise<number | Record<string, any> | undefined>;
    /**
     * Updates an existing item.
     * @param item - The item to update.
     * @returns A promise that resolves once the update operation is completed.
     */
    update(item: ITEM | undefined): Promise<Record<string, any> | undefined>;
    /**
     * Inserts a new item.
     * @param item - The item to insert.
     * @returns A promise that resolves once the insert operation is completed.
     */
    insert(item: ITEM | undefined): Promise<number | undefined>;
    /**
     * Overwrites an item with new values.
     * @param item - The item to overwrite.
     * @param values - The new values to overwrite the item with.
     * @param [reload=true] - Whether to reload the item after overwriting.
     * @returns A promise that resolves once the overwrite operation is completed.
     */
    overwrite(item: ITEM | undefined, values: Record<string, any>, reload?: boolean): Promise<Record<string, any> | undefined>;
    /**
     * Deletes an item.
     * @param item - The item to delete.
     * @returns A promise that resolves once the delete operation is completed.
     */
    delete(item: ITEM | undefined): Promise<Record<string, any> | undefined>;
}
