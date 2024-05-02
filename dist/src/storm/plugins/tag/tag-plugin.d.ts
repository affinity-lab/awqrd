import { EntityRepository } from "../../entity-repository.ts";
import { TagRepository } from "./tag-repository";
import { GroupTagRepository } from "@affinity-lab/awqrd-storm/plugins/tag/group-tag-repository";
import { type MySql2Database } from "drizzle-orm/mysql2";
import { MySqlTable } from "drizzle-orm/mysql-core";
import { type EntityInitiator } from "@affinity-lab/awqrd-storm/types";
import { Entity } from "@affinity-lab/awqrd-storm/entity";
export declare function tagPlugin<DB extends MySql2Database<any>, SCHEMA extends MySqlTable, ENTITY extends EntityInitiator<ENTITY, typeof Entity>>(repository: EntityRepository<DB, SCHEMA, ENTITY>, tagRepository: GroupTagRepository<any, any, any>, field: string, groupField: string): void;
export declare function tagPlugin<DB extends MySql2Database<any>, SCHEMA extends MySqlTable, ENTITY extends EntityInitiator<ENTITY, typeof Entity>>(repository: EntityRepository<DB, SCHEMA, ENTITY>, tagRepository: TagRepository<any, any, any>, field: string): void;
