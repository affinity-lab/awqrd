import { TagEntity, TagRepository } from "@affinity-lab/awqrd-storm/plugins/tag/tag-repository";
import { type MySql2Database } from "drizzle-orm/mysql2";
import { type MySqlTable } from "drizzle-orm/mysql-core";
import type { Dto, EntityInitiator } from "@affinity-lab/awqrd-storm/types";
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
    protected doRename(oldName: string, newName: string): Promise<void>;
}
