import { type MaybeUnset } from "@affinity-lab/awqrd-util/types.ts";
/**
 * Class representing a storm entity.
 */
export declare class Entity {
    /** The ID of the entity. */
    id: MaybeUnset<number>;
    private static get exportFields();
    $export(): Record<string, any>;
    $pick(...fields: string[]): Record<string, any>;
    $omit(...fields: string[]): Record<string, any>;
}
