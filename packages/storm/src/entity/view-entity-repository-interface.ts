import {MaybeUndefined, MaybeUnset, ProcessPipeline, T_Class} from "@affinity-lab/util";
import {MySqlTableWithColumns} from "drizzle-orm/mysql-core";
import type {MySql2Database} from "drizzle-orm/mysql2";
import type {Dto, WithId} from "../types";

import {ViewEntity} from "./view-entity";


export interface ViewEntityRepositoryInterface<
	SCHEMA extends MySqlTableWithColumns<any> = MySqlTableWithColumns<any>,
	ITEM extends ViewEntity = ViewEntity,
	ENTITY extends T_Class<ITEM, typeof ViewEntity> = T_Class<ITEM, typeof ViewEntity>,
	DTO extends Dto<SCHEMA> = Dto<SCHEMA> & Record<string, any>
> {
	readonly db: MySql2Database<any>
	readonly schema: SCHEMA,
	readonly entity: ENTITY

	fields: string[];
	pipelines: {
		getAll: ProcessPipeline<"prepare" | "action" | "finalize">;
		getOne: ProcessPipeline<"prepare" | "action" | "finalize">;
		getArray: ProcessPipeline<"prepare" | "action" | "finalize">
	};
	instantiate: {
		all: (dtoSet: Array<DTO>) => Promise<Array<ITEM>>;
		one: (dto: (DTO | undefined)) => Promise<undefined | ITEM>;
		first: (dtoSet: Array<DTO>) => Promise<MaybeUndefined<ITEM>>
	};

	getRawDTO(id: MaybeUnset<number>): Promise<MaybeUndefined<DTO>>;

	get(): Promise<Array<WithId<ITEM>>>;
	get(ids: Array<number>): Promise<Array<WithId<ITEM>>>;
	get(id: MaybeUnset<number>): Promise<WithId<ITEM> | undefined>;

	create(): Promise<ITEM>;
	reload(item: any): Promise<void>;
}