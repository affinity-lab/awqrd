/**
 * Filters the fields of an object based on a provided list of field names.
 * @param values - The object containing the fields to be filtered.
 * @param fields - An array of field names to include in the filtered result.
 * @returns An object containing only the fields specified in the 'fields' array.
 */
export declare function pickFieldsIP(values: Record<string, any>, ...fields: string[]): void;
/**
 * Omits specified fields from an object.
 * @param values - The object containing the fields to be omitted.
 * @param fields - An array of field names to be omitted from the object.
 * @returns An object containing all fields except those specified in the 'fields' array.
 */
export declare function omitFieldsIP(values: Record<string, any>, ...fields: string[]): void;
/**
 * Filters the fields of an object based on a provided list of field names and returns a new object.
 * @param values - The object containing the fields to be filtered.
 * @param fields - An array of field names to include in the filtered result.
 * @returns A new object containing only the fields specified in the 'fields' array.
 */
export declare function pickFields(values: Record<string, any>, ...fields: string[]): Record<string, any>;
/**
 * Omits specified fields from an object and returns a new object.
 * @param values - The object containing the fields to be omitted.
 * @param fields - An array of field names to be omitted from the object.
 * @returns A new object containing all fields except those specified in the 'fields' array.
 */
export declare function omitFields(values: Record<string, any>, ...fields: string[]): Record<string, any>;
/**
 * Retrieves the first element of an array or returns undefined if the array is blank.
 * @param array - The array from which to retrieve the first element.
 * @returns The first element of the array, or undefined if the array is blank.
 */
export declare function firstOrUndefined(array: Array<any>): any;
/**
 * Generates a map from an array of items using a specified key.
 * @template T - The type of items.
 * @param items - An array of items.
 * @param key - The key to use for mapping.
 * @returns A map where the keys are IDs and the values are items.
 */
export declare function keyMap<T extends Record<string, any>>(items: Array<T>, key?: string): Record<number, T>;
