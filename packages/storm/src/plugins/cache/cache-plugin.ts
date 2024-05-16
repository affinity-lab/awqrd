import type {Cache, State} from "@affinity-lab/util/";
import {EntityRepositoryInterface} from "../../entity/entity-repository-interface";
import {resultCacheFactory, type ResultCacheFn} from "./result-cache-factory";


export function cachePlugin(cache: Cache, resultCache?: ResultCacheFn) {
	return (repository: EntityRepositoryInterface) => {
		if (resultCache === undefined) resultCache = resultCacheFactory(cache);

		repository.pipelines.getOne.blocks
			.prepare.append(async (state: Record<string, any>) => state.dto = await cache.get(state.id))
			.finalize.prepend(async (state: Record<string, any>) => state.dto !== undefined && await resultCache!(state.dto)
		)

		repository.pipelines.getArray.blocks
			.prepare.append(async (state: State<{ ids: Array<number>, dtos: Array<{ id: number }> }>) => {
				state.dtos = await cache.get(state.ids);
				let dtoIds = state.dtos.map(dto => dto.id);
				state.ids = state.ids.filter(num => !dtoIds.includes(num));
			})
			.finalize.prepend(async (state: State<{ dtos: Array<{ id: number }> }>) => await resultCache!(state.dtos)
		)

		repository.pipelines.update.blocks
			.finalize.append(async (state: State<{ item: { id: number } }>) => await cache.del(state.item.id))
		repository.pipelines.delete.blocks
			.finalize.append(async (state: State<{ item: { id: number } }>) => await cache.del(state.item.id))
		repository.pipelines.overwrite.blocks
			.finalize.append(async (state: State<{ item: { id: number } }>) => await cache.del(state.item.id))

	}
}