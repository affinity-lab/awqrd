import {ProcessPipeline, T_Class} from "@affinity-lab/util";
import {MySqlTableWithColumns} from "drizzle-orm/mysql-core";
import {MySqlTable} from "drizzle-orm/mysql-core/index";
import type {Dto} from "../types";
import {Entity} from "./entity";
import {ViewEntityRepositoryInterface} from "./view-entity-repository-interface";


export interface EntityRepositoryInterface<
	SCHEMA extends MySqlTableWithColumns<any> = MySqlTableWithColumns<any>,
	ITEM extends Entity = Entity,
	ENTITY extends T_Class<ITEM, typeof Entity> = T_Class<ITEM, typeof Entity>,
	DTO extends Dto<SCHEMA> = Dto<SCHEMA> & Record<string, any>
> extends ViewEntityRepositoryInterface <SCHEMA, ITEM, ENTITY, DTO> {
	pipelines: {
		getAll: ProcessPipeline<"prepare" | "action" | "finalize">;
		getOne: ProcessPipeline<"prepare" | "action" | "finalize">;
		getArray: ProcessPipeline<"prepare" | "action" | "finalize">;
		insert: ProcessPipeline<"prepare" | "action" | "finalize">;
		update: ProcessPipeline<"prepare" | "action" | "finalize">;
		delete: ProcessPipeline<"prepare" | "action" | "finalize">;
		overwrite: ProcessPipeline<"prepare" | "action" | "finalize">;
	};
	save(item: ITEM): Promise<any>;
	update(item: ITEM): Promise<any>;
	insert(item: ITEM): Promise<any>;
	overwrite(item: ITEM, values: Record<string, any>, reload?: boolean): Promise<any>;
	delete(item: ITEM): Promise<any>;
	create(importData?: Dto<MySqlTable>): Promise<ITEM>;
}