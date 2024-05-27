import { Cache, NonEmptyArray } from "@affinity-lab/util";
export declare class ResultCache {
    readonly cache: Cache;
    constructor(cache: Cache);
    set(res: Record<string, any> | Array<Record<string, any>>): Promise<any[] | Record<string, any>>;
    get get(): {
        (key: string | number): Promise<any>;
        (keys: (string | number)[]): Promise<any[]>;
    };
    get del(): {
        (key: string | number): Promise<void>;
        (keys: (string | number)[]): Promise<void>;
    };
    get setter(): (res: Record<string, any> | Record<string, any>[]) => Promise<any[] | Record<string, any>>;
}
export declare class ResultCacheWithMaps extends ResultCache {
    readonly cache: Cache;
    readonly mapCache: Cache;
    readonly mappedFields: NonEmptyArray<string>;
    constructor(cache: Cache, mapCache: Cache, mappedFields: NonEmptyArray<string>);
    set(res: Record<string, any> | Array<Record<string, any>>): Promise<any[] | Record<string, any>>;
}
