type Constructor = (new () => Object) | Function;
type ClassMetaDataStore = Record<string, SingleStore | ArrayStore>;
declare class ObjectStore {
    value: Record<string, any>;
}
declare class SingleStore {
    value: any;
}
declare class ArrayStore {
    value: any[];
}
/**
 * Class to store metadata for a class
 * @class MetaDataStore
 */
export declare class MetaDataStore {
    readonly target: Constructor;
    /**
     * @type {ClassMetaDataStore}
     * @description The metadata records
     */
    records: ClassMetaDataStore;
    /**
     * @constructor
     * @param target
     */
    constructor(target: Constructor);
    /**
     * Merge metadata
     * @param key
     * @param value
     */
    merge(key: string | string[], value: Record<string, any>): void;
    /**
     * Set metadata
     * @param key
     * @param value
     */
    set(key: string | string[], value: any): void;
    /**
     * Push metadata
     * @param key
     * @param value
     */
    push(key: string | string[], value: any): void;
    /**
     * Delete metadata
     * @param key
     */
    delete(key: string | string[]): void;
    private key;
}
/**
 * Class to store metadata for classes
 */
export declare class MetaValue {
    readonly store: ObjectStore | SingleStore | ArrayStore;
    readonly self: any;
    readonly inherited: Array<any>;
    value: any;
    constructor(store: ObjectStore | SingleStore | ArrayStore, self?: boolean);
    addInherited(value: any): void;
}
/**
 * Class to store metadata for classes
 */
export declare class ClassMetaData {
    /**
     * @type {Array<MetaDataStore>} stores - The metadata stores
     */
    stores: Array<MetaDataStore>;
    constructor();
    /**
     * Get metadata for a class
     * @param target
     */
    get(target: Constructor): MetaDataStore | undefined;
    get(target: Constructor, create: false): MetaDataStore | undefined;
    get(target: Constructor, create: true): MetaDataStore;
    /**
     * Read metadata for a class
     * @param target
     * @param options
     */
    read(target: Constructor, options?: {
        flatten?: boolean;
        simple?: boolean;
    }): undefined | Record<string, any>;
}
export {};
