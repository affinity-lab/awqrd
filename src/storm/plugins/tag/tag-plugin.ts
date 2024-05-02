import type {State} from "@affinity-lab/awqrd-util/process-pipeline.ts";
import {EntityRepository} from "../../entity-repository.ts";
import {TagRepository, type Usage} from "./tag-repository";
import {GroupTagRepository} from "@affinity-lab/awqrd-storm/plugins/tag/group-tag-repository";
import {type MySql2Database} from "drizzle-orm/mysql2";
import {MySqlTable} from "drizzle-orm/mysql-core";
import {type EntityInitiator} from "@affinity-lab/awqrd-storm/types";
import {Entity} from "@affinity-lab/awqrd-storm/entity";

// type Helper<OBJECT extends typeof Entity, ENTITY extends EntityInitiator<ENTITY, OBJECT>, DB extends MySql2Database<any> = MySql2Database<any>, SCHEMA extends MySqlTable =  MySqlTable>;
// type Helper<DB extends MySql2Database<any>, SCHEMA extends MySqlTable, ENTITY extends EntityInitiator<ENTITY, typeof Entity>>;
// TODO add group
export function tagPlugin(repository: EntityRepository<any, any, any>, tagRepository: GroupTagRepository<any, any, any>, field: string, groupField: string): void
export function tagPlugin(repository: EntityRepository<any, any, any>, tagRepository: TagRepository<any, any, any>, field: string): void
export function tagPlugin<DB extends MySql2Database<any>, SCHEMA extends MySqlTable, ENTITY extends EntityInitiator<ENTITY, typeof Entity>>(repository: EntityRepository<any, any, any>, tagRepository: TagRepository<any, any, any> | GroupTagRepository<any, any, any>, field: string, groupField?: string) {

	console.log("********* TAG PLUGIN START *********")
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
	console.log("********* TAG PLUGIN END *********")
}