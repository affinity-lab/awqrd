import { EntityRepository } from "../../entity-repository";
import { Entity } from "../../entity";
import { MySqlTable } from "drizzle-orm/mysql-core";
import { type MySql2Database } from "drizzle-orm/mysql2";
import type { MaybeArray } from "@affinity-lab/awqrd-util";
import type { Dto, EntityInitiator } from "../../types";
import { type State } from "@affinity-lab/awqrd-util";
import type { MaybeNull } from "@affinity-lab/awqrd-util";
export type Usage = {
    "repo": EntityRepository<any, any, any>;
    "field": string;
} & Record<string, any>;
export declare class TagEntity extends Entity {
    name: MaybeNull<string>;
}
export declare class TagRepository<DB extends MySql2Database<any>, SCHEMA extends MySqlTable, ENTITY extends EntityInitiator<ENTITY, typeof TagEntity>> extends EntityRepository<DB, SCHEMA, ENTITY> {
    protected usages: Array<Usage>;
    addUsage(usage: MaybeArray<Usage>): void;
    protected get stmt_getByName(): (args: {
        names: Array<string>;
    }) => Promise<Dto<SCHEMA>[]>;
    getByName(names: Array<string>): Promise<Array<Dto<SCHEMA>>>;
    getByName(names: string): Promise<Dto<SCHEMA> | undefined>;
    prepare(repository: EntityRepository<any, any, any>, state: State): void;
    protected changes(repository: EntityRepository<any, any, any>, state: State): {
        prev: Array<string>;
        curr: Array<string>;
    };
    updateTag(repository: EntityRepository<any, any, any>, state: State): Promise<void>;
    protected addTag(names: Array<string>): Promise<void>;
    protected deleteTag(names: Array<string>): Promise<void>;
    protected deleteItems(items: Array<Dto<SCHEMA>>): Promise<void>;
    deleteInUsages(name: string): Promise<void>;
    protected doRename(oldName: string, newName: string): void;
    selfRename(state: State): Promise<void>;
    rename(oldName: string, newName: string): Promise<void>;
}
