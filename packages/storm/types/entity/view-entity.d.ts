import { MaybeNull } from "@affinity-lab/util";
import { ViewEntityRepositoryInterface } from "./view-entity-repository-interface";
/**
 * Class representing a storm view entity.
 */
export declare abstract class ViewEntity {
    static repository: ViewEntityRepositoryInterface;
    get $repository(): ViewEntityRepositoryInterface<any, any, any, any>;
    id: MaybeNull<number>;
    constructor();
    private static get exportFields();
    /**
     * Exports the entity to a plain object for exporting.
     * @returns A plain object representation of the entity.
     */
    $export(): Record<string, any>;
    /**
     * Picks specified fields from export.
     * @param fields
     */
    $pick(...fields: string[]): Record<string, any>;
    /**
     * Omits specified fields from export.
     * @param fields
     */
    $omit(...fields: string[]): Record<string, any>;
    /**
     * Returns a JSON representation of the entity.
     * @returns A JSON representation of the entity.
     */
    toJSON(): Record<string, any>;
    /**
     * Returns a string representation of the entity.
     * @returns A string representation of the entity.
     */
    toString(): string;
}
