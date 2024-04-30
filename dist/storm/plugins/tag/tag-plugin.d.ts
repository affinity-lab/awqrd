import { EntityRepository } from "../../entity-repository.ts";
import { TagRepository } from "./tag-repository";
export declare function tagPlugin(repository: EntityRepository<any, any, any>, tagRepository: TagRepository<any, any, any>, field: string): void;
