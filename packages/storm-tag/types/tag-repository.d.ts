import { Dto, Entity, EntityRepository, EntityRepositoryInterface } from "@affinity-lab/storm";
import type { MaybeArray, T_Class } from "@affinity-lab/util";
import { MySqlTable } from "drizzle-orm/mysql-core";
export type Usage = {
    repo: EntityRepositoryInterface;
    field: string;
};
export declare class TagEntity extends Entity {
    name: string;
}
export declare class TagRepository<SCHEMA extends MySqlTable, ITEM extends TagEntity, DTO extends Dto<SCHEMA> & {
    name: string;
} = Dto<SCHEMA> & {
    name: string;
}, ENTITY extends T_Class<ITEM, typeof TagEntity> = T_Class<ITEM, typeof TagEntity>> extends EntityRepository<SCHEMA, ITEM> {
    protected usages: Array<Usage>;
    protected stmt_getByName: (args: {
        names: Array<string>;
    }) => Promise<ITEM[]>;
    /**
     * Get tags by name
     * @param names
     */
    getByName(names: Array<string>): Promise<Array<ITEM>>;
    getByName(name: string): Promise<ITEM | undefined>;
    /**
     * Rename the tag
     * @param oldName
     * @param newName
     */
    rename(oldName: string, newName: string): Promise<void>;
    /**
     * Delete a tag from all usages
     * @param name
     */
    deleteInUsages(name: string): Promise<void>;
    /**
     * Add a usage to the tag
     * @param usage
     */
    protected addUsage(usage: MaybeArray<Usage>): void;
    /**
     * Rename the tag
     * @param dto
     * @param prevDto
     */
    protected selfRename(dto: DTO, prevDto: DTO): Promise<void>;
    /**
     * Update the tag
     * @param repository
     * @param dto
     * @param prevDto
     */
    protected updateTag(repository: EntityRepositoryInterface, dto: DTO | {}, prevDto: DTO): Promise<void>;
    /**
     * Normalize the tag values
     * @param repository
     * @param dto
     */
    protected prepare(repository: EntityRepositoryInterface, dto: Record<string, any>): void;
    protected changes(repository: EntityRepositoryInterface, dto: Record<string, any>, prevDto: Record<string, any>): {
        prev: Array<string>;
        curr: Array<string>;
    };
    protected deleteTag(names: Array<string>): Promise<void>;
    protected deleteItems(items: Array<ITEM>): Promise<void>;
    protected addTag(names: Array<string>): Promise<void>;
    protected doRename(oldName: string, newName: string): Promise<void>;
    plugin(field: string): (repository: EntityRepositoryInterface) => void;
}
