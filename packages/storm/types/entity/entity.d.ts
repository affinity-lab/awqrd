import { EntityRepositoryInterface } from "./entity-repository-interface";
import { ViewEntity } from "./view-entity";
/**
 * Class representing a storm entity.
 */
export declare abstract class Entity extends ViewEntity {
    static repository: EntityRepositoryInterface;
    get $repository(): EntityRepositoryInterface<any, any, any, any>;
    private static get importFields();
    /**
     * Imports data into the entity.
     * @param importData
     */
    $import(importData: Record<string, any>): this;
    /**
     * Saves the entity to the database.
     */
    $save(): Promise<any>;
    /**
     * Deletes the entity from the database.
     */
    $delete(): Promise<any>;
    /**
     * Overwrites the entity with the provided data, without validation.
     * @param data
     */
    $overwrite(data: Record<string, any>): Promise<any>;
}
