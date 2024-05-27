import { ProcessPipeline, T_Class } from "@affinity-lab/util";
import { MySqlTableWithColumns } from "drizzle-orm/mysql-core";
import { MySqlTable } from "drizzle-orm/mysql-core";
import type { Dto } from "../types";
import { Entity } from "./entity";
import { ViewEntityRepositoryInterface } from "./view-entity-repository-interface";
export interface EntityRepositoryInterface<SCHEMA extends MySqlTableWithColumns<any> = any, ITEM extends Entity = any, ENTITY extends T_Class<ITEM, typeof Entity> = any, DTO extends Dto<SCHEMA> = any> extends ViewEntityRepositoryInterface<SCHEMA, ITEM, ENTITY, DTO> {
    pipelines: {
        getAll: ProcessPipeline<"prepare" | "action" | "finalize">;
        getOne: ProcessPipeline<"prepare" | "action" | "finalize">;
        getArray: ProcessPipeline<"prepare" | "action" | "finalize">;
        insert: ProcessPipeline<"prepare" | "action" | "finalize">;
        update: ProcessPipeline<"prepare" | "action" | "finalize">;
        delete: ProcessPipeline<"prepare" | "action" | "finalize">;
        overwrite: ProcessPipeline<"prepare" | "action" | "finalize">;
    };
    addPlugin(plugin: (repository: EntityRepositoryInterface) => any): this;
    save(item: ITEM | undefined): Promise<any>;
    update(item: ITEM | undefined): Promise<any>;
    insert(item: ITEM | undefined): Promise<any>;
    overwrite(item: ITEM | undefined, values: Record<string, any>, reload?: boolean): Promise<any>;
    delete(item: ITEM | undefined): Promise<any>;
    create(importData?: Dto<MySqlTable>): Promise<ITEM>;
}
