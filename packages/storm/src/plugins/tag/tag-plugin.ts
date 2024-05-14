import type {State} from "@affinity-lab/util";
import {MySqlTable} from "drizzle-orm/mysql-core";
import {Entity} from "../../entity";
import {EntityRepository} from "../../entity-repository";
import {GroupTagRepository} from "./group-tag-repository";
import {TagRepository, type Usage} from "./tag-repository";
import {prevDto} from "../../helper";


export function tagPlugin<SCHEMA extends MySqlTable, ITEM extends Entity>(repository: EntityRepository<SCHEMA, ITEM>, tagRepository: GroupTagRepository<any, any>, field: string, groupField: string): void
export function tagPlugin<SCHEMA extends MySqlTable, ITEM extends Entity>(repository: EntityRepository<SCHEMA, ITEM>, tagRepository: TagRepository<any, any>, field: string): void
export function tagPlugin<SCHEMA extends MySqlTable, ITEM extends Entity>(repository: EntityRepository<SCHEMA, ITEM>, tagRepository: TagRepository<any, any> | GroupTagRepository<any, any>, field: string, groupField?: string) {

	let usage: Usage = {repo: repository, field}
	if (groupField) usage[(tagRepository as GroupTagRepository<any, any, any>).fieldName] = (repository as Record<string, any>)[groupField] // TODO CHECK IF THIS WORKS AND IF YES TRY TO TYPEHINT IT
	tagRepository.addUsage(usage);

	repository.pipelines.update.blocks
		.prepare.append(async (state: State) => {
		await prevDto(state, repository);
		tagRepository.prepare(repository, state);
	})
		.finalize.append(async (state: State) => {
		await tagRepository.selfRename(state, groupField);
		await tagRepository.updateTag(repository, state, groupField);
	})

	repository.pipelines.delete.blocks
		.finalize.append(async (state: State) => {
		await tagRepository.updateTag(repository, state, groupField);
	})

	repository.pipelines.insert.blocks
		.prepare.append(async (state: State) => {
		await prevDto(state, repository);
		tagRepository.prepare(repository, state);
	})

	repository.pipelines.overwrite.blocks
		.finalize.append(async (state: State) => {
		await tagRepository.selfRename(state, groupField);
		await tagRepository.updateTag(repository, state, groupField);
	})
}