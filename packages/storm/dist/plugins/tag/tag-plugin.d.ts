import { EntityRepository } from "../../entity-repository";
import { TagRepository } from "./tag-repository";
import { GroupTagRepository } from "./group-tag-repository";
import { type MySql2Database } from "drizzle-orm/mysql2";
import { MySqlTable } from "drizzle-orm/mysql-core";
import { type EntityInitiator } from "../../types";
import { Entity } from "../../entity";
export declare function tagPlugin<DB extends MySql2Database<any>, SCHEMA extends MySqlTable, ENTITY extends EntityInitiator<ENTITY, typeof Entity>>(repository: EntityRepository<DB, SCHEMA, ENTITY>, tagRepository: GroupTagRepository<any, any, any>, field: string, groupField: string): void;
export declare function tagPlugin<DB extends MySql2Database<any>, SCHEMA extends MySqlTable, ENTITY extends EntityInitiator<ENTITY, typeof Entity>>(repository: EntityRepository<DB, SCHEMA, ENTITY>, tagRepository: TagRepository<any, any, any>, field: string): void;
