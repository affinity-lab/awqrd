import { Dto, EntityRepositoryInterface } from "@affinity-lab/storm";
import { T_Class } from "@affinity-lab/util";
import { type MySqlTable } from "drizzle-orm/mysql-core";
import { type MySql2Database } from "drizzle-orm/mysql2";
import { TagEntity, TagRepository } from "./tag-repository";
export type GroupUsage = {
    repo: EntityRepositoryInterface;
    field: string;
    groupField: string;
    mode?: "JSON" | "LIST";
};
export declare class GroupTagEntity extends TagEntity {
    groupId: number | string;
}
export declare class GroupTagRepository<SCHEMA extends MySqlTable, ITEM extends GroupTagEntity, DTO extends Dto<SCHEMA> & {
    name: string;
} = Dto<SCHEMA> & {
    name: string;
}, ENTITY extends T_Class<ITEM, typeof GroupTagEntity> = T_Class<ITEM, typeof GroupTagEntity>> extends TagRepository<SCHEMA, ITEM> {
    readonly db: MySql2Database<any>;
    readonly schema: SCHEMA;
    readonly entity: ENTITY;
    protected usages: Array<GroupUsage>;
    constructor(db: MySql2Database<any>, schema: SCHEMA, entity: ENTITY);
    protected get stmt_groupGetByName(): (args: {
        names: Array<string>;
        groupId: number | string;
    }) => Promise<ITEM[]>;
    /**
     * Get tags by name and groupId
     * @param names
     * @param groupId
     */
    getByName(names: Array<string>, groupId?: number | string): Promise<Array<ITEM>>;
    getByName(name: string, groupId?: number | string): Promise<ITEM | undefined>;
    /**
     * Delete a tag from all usages
     * @param name
     * @param groupId
     */
    deleteInUsages(name: string, groupId?: number | string): Promise<void>;
    /**
     * Rename a tag
     * @param oldName
     * @param newName
     * @param groupId
     */
    rename(oldName: string, newName: string, groupId?: number | string): Promise<void>;
    updateTag(repository: EntityRepositoryInterface, dto: Record<string, any>, prevDto: Record<string, any>, fieldName?: string): Promise<void>;
    selfRename(dto: Record<string, any>, prevDto: Record<string, any>, fieldName?: string): Promise<void>;
    protected addTag(names: Array<string>, groupId?: number | string): Promise<void>;
    protected deleteTag(names: Array<string>, groupId?: number | string): Promise<void>;
    protected deleteItems(items: Array<ITEM>, groupId?: number | string): Promise<void>;
    protected doRename(oldName: string, newName: string, groupId?: number | string): Promise<void>;
    plugin(field: string, groupField?: string, mode?: "JSON" | "LIST"): (repository: EntityRepositoryInterface) => void;
}
