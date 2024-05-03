import type {InferSelectModel} from "drizzle-orm";
import type {MySqlTable} from "drizzle-orm/mysql-core";
import type {MaybeUnset} from "@affinity-lab/util";

export type WithIdOptional<TYPE = {}> = Omit<TYPE, "id"> & { id: MaybeUnset<number> }
export type WithId<TYPE = {}> = { id: number } & TYPE
export type WithIds<TYPE = {}> = { ids: Array<number> } & TYPE

export type Dto<SCHEMA extends MySqlTable> = WithIdOptional<InferSelectModel<SCHEMA>>
export type Item<ENTITY extends new (...args: any) => WithIdOptional<InstanceType<ENTITY>>> = WithIdOptional<InstanceType<ENTITY>>

export type EntityInitiator<ENTITY extends new (...args: any) => WithIdOptional<InstanceType<ENTITY>>, OBJECT> = OBJECT & (new (...args:any[])=>Item<ENTITY>)

export type IEntity = { id: number | undefined | null } & Record<string, any>
export type IExistingEntity = { id: number} & Record<string, any>