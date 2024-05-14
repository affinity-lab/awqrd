import type {InferSelectModel} from "drizzle-orm";
import type {MySqlTable} from "drizzle-orm/mysql-core";
import type {MaybeNull} from "@affinity-lab/util";

export type WithIdOptional<TYPE = {}> = { id: MaybeNull<number> } & TYPE;
export type WithId<TYPE = {}> = { id: number } & TYPE;
export type WithIds<TYPE = {}> = { ids: Array<number> } & TYPE;

export type Dto<SCHEMA extends MySqlTable> = WithIdOptional<InferSelectModel<SCHEMA>>;
export type EntityFields<SCHEMA extends MySqlTable> = Partial<WithIdOptional<Omit<InferSelectModel<SCHEMA>, "id">>>;

export type T_Constructor<T> = (new (...args: any[]) => T);
export type T_Class<T, C> = T_Constructor<T> & C;
