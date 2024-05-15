import type {State} from "@affinity-lab/util";
import {MySqlTable} from "drizzle-orm/mysql-core";
import {Entity} from "../../entity/entity";
import {EntityRepositoryInterface} from "../../entity/entity-repository-interface";
import {prevDto} from "../../helper";
import {GroupTagRepository} from "./group-tag-repository";
import {TagRepository, type Usage} from "./tag-repository";

/**
 * Tag plugin
 * @param repository
 * @param tagRepository
 * @param field
 * @param groupField
 */
export function tagPlugin<SCHEMA extends MySqlTable, ITEM extends Entity>(repository: EntityRepositoryInterface, tagRepository: GroupTagRepository<any, any>, field: string, groupField: string): void
export function tagPlugin<SCHEMA extends MySqlTable, ITEM extends Entity>(repository: EntityRepositoryInterface, tagRepository: TagRepository<any, any>, field: string): void
export function tagPlugin<SCHEMA extends MySqlTable, ITEM extends Entity>(repository: EntityRepositoryInterface, tagRepository: TagRepository<any, any> | GroupTagRepository<any, any>, field: string, groupField?: string) {

	let usage: Usage = {repo: repository, field}
	if (groupField) usage[(tagRepository as GroupTagRepository<any, any, any>).fieldName] = (repository as Record<string, any>)[groupField] // TODO CHECK IF THIS WORKS AND IF YES TRY TO TYPEHINT IT
	tagRepository.addUsage(usage);

	repository.pipelines.update.blocks
		.prepare.append(async (state: State) => await prevDto(state, repository))
		.prepare.append(async (state: State) => tagRepository.prepare(repository, state.dto))
		.finalize.append(async (state: State) => {
			if (tagRepository instanceof GroupTagRepository) {
				await tagRepository.selfRename(state.dto, state.prevDto, groupField);
				await tagRepository.updateTag(repository, state.dto, state.prevDto, groupField);
			} else {
				await tagRepository.selfRename(state.dto, state.prevDto);
				await tagRepository.updateTag(repository, state.dto, state.prevDto);
			}
		}
	)

	repository.pipelines.delete.blocks
		.prepare.append(async (state: State) => await prevDto(state, repository))
		.finalize.append(async (state: State) => {
			if (tagRepository instanceof GroupTagRepository) {
				await tagRepository.updateTag(repository, state.dto, state.prevDto, groupField);
			} else {
				await tagRepository.updateTag(repository, state.dto, state.prevDto);
			}
		}
	)

	repository.pipelines.insert.blocks
		.prepare.append(async (state: State) => tagRepository.prepare(repository, state.dto))

	repository.pipelines.overwrite.blocks
		.prepare.append(async (state: State) => await prevDto(state, repository))
		.finalize.append(async (state: State) => {
			if (tagRepository instanceof GroupTagRepository) {
				await tagRepository.selfRename(state.dto, await prevDto(state, repository), groupField);
				await tagRepository.updateTag(repository, state.dto, await prevDto(state, repository), groupField);
			} else {
				await tagRepository.selfRename(state.dto, await prevDto(state, repository));
				await tagRepository.updateTag(repository, state.dto, await prevDto(state, repository));
			}
		}
	)
}