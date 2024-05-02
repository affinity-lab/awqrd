import { TagEntity, TagRepository } from "./tag-repository";
import { type MySql2Database } from "drizzle-orm/mysql2";
import { type MySqlTable } from "drizzle-orm/mysql-core";
import type { Dto, EntityInitiator } from "../../types";
import { type State } from "@affinity-lab/awqrd-util";
import { EntityRepository } from "../../entity-repository";
export declare class GroupTagEntity extends TagEntity {
    groupId: number | string | null;
}
export declare class GroupTagRepository<DB extends MySql2Database<any>, SCHEMA extends MySqlTable, ENTITY extends EntityInitiator<ENTITY, typeof GroupTagEntity>> extends TagRepository<DB, SCHEMA, ENTITY> {
    readonly db: DB;
    readonly schema: SCHEMA;
    readonly entity: ENTITY;
    readonly fieldName: string;
    constructor(db: DB, schema: SCHEMA, entity: ENTITY, fieldName?: string);
    protected get stmt_groupGetByName(): (args: {
        names: Array<string>;
        groupId: number | string;
    }) => Promise<Dto<SCHEMA>[]>;
    getByName(names: Array<string>, groupId?: number | string): Promise<Array<Dto<SCHEMA>>>;
    getByName(names: string, groupId?: number | string): Promise<Dto<SCHEMA> | undefined>;
    updateTag(repository: EntityRepository<any, any, any>, state: State, fieldName?: string): Promise<void>;
    protected doRename(oldName: string, newName: string, groupId?: number | string): Promise<void>;
    selfRename(state: State, fieldName?: string): Promise<void>;
    protected addTag(names: Array<string>, groupId?: number | string): Promise<void>;
    protected deleteTag(names: Array<string>, groupId?: number | string): Promise<void>;
    protected deleteItems(items: Array<Dto<SCHEMA>>, groupId?: number | string): Promise<void>;
    deleteInUsages(name: string, groupId?: number | string): Promise<void>;
    rename(oldName: string, newName: string, groupId?: number | string): Promise<void>;
}
