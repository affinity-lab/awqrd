import type {State} from "@affinity-lab/util";
import {EntityRepository} from "../../entity-repository";
import {TagRepository, type Usage} from "./tag-repository";
import {GroupTagRepository} from "./group-tag-repository";
import {type MySql2Database} from "drizzle-orm/mysql2";
import {MySqlTable} from "drizzle-orm/mysql-core";
import {type EntityInitiator} from "../../types";
import {Entity} from "../../entity";

// TODO add group
export function tagPlugin<DB extends MySql2Database<any>, SCHEMA extends MySqlTable, ENTITY extends EntityInitiator<ENTITY, typeof Entity>>(repository: EntityRepository<DB, SCHEMA, ENTITY>, tagRepository: GroupTagRepository<any, any, any>, field: string, groupField: string): void
export function tagPlugin<DB extends MySql2Database<any>, SCHEMA extends MySqlTable, ENTITY extends EntityInitiator<ENTITY, typeof Entity>>(repository: EntityRepository<DB, SCHEMA, ENTITY>, tagRepository: TagRepository<any, any, any>, field: string): void
export function tagPlugin<DB extends MySql2Database<any>, SCHEMA extends MySqlTable, ENTITY extends EntityInitiator<ENTITY, typeof Entity>>(repository: EntityRepository<DB, SCHEMA, ENTITY>, tagRepository: TagRepository<any, any, any> | GroupTagRepository<any, any, any>, field: string, groupField?: string) {

	let usage: Usage = {repo: repository, field}
	if(groupField) usage[(tagRepository as GroupTagRepository<any, any, any>).fieldName] = (repository as Record<string, any>)[groupField] // TODO CHECK IF THIS WORKS AND IF YES TRY TO TYPEHINT IT
	tagRepository.addUsage(usage);

	repository.pipelines.update.blocks
		.prepare.append(async (state: State) => {
			state.prevDto = await repository.getRaw(state.item.id);
			tagRepository.prepare(repository, state);
	} )
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
			state.prevDto = await repository.getRaw(state.item.id);
			tagRepository.prepare(repository, state);
	} )

	repository.pipelines.overwrite.blocks
		.finalize.append(async (state: State) => {
		await tagRepository.selfRename(state, groupField);
		await tagRepository.updateTag(repository, state, groupField);
	})
}