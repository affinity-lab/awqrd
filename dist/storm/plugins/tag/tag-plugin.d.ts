import { EntityRepository } from "../../entity-repository.ts";
import { TagRepository } from "./tag-repository";
import { GroupTagRepository } from "@affinity-lab/awqrd-storm/plugins/tag/group-tag-repository";
export declare function tagPlugin(repository: EntityRepository<any, any, any>, tagRepository: GroupTagRepository<any, any, any>, field: string, groupField: string): void;
export declare function tagPlugin(repository: EntityRepository<any, any, any>, tagRepository: TagRepository<any, any, any>, field: string): void;
