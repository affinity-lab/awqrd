import type {Cache} from "@affinity-lab/util/";
import {EntityRepositoryInterface} from "../../entity/entity-repository-interface";
import {getByFactory} from "../../helper";
import type {WithId} from "../../types";
import {type ResultCacheFn} from "./result-cache-factory";


/**
 * Returns a function that will get an item by a field name and cache the result.
 * @param repo
 * @param fieldName
 * @param resultCache
 * @param mapCache
 */
export function cachedGetByFactory<T extends string | number, R>(
	repo: EntityRepositoryInterface,
	fieldName: string,
	resultCache: ResultCacheFn,
	mapCache: Cache
): (search: T) => Promise<R | undefined> {

	let getBy = getByFactory(repo, fieldName);

	return async (search: T) => {
		let key = `<${fieldName}>:${search}`;
		let id = await mapCache.get(key);
		if (id) {
			let state = await repo.pipelines.getOne.run(repo, {id});
			if (state.dto[fieldName] === search) return state.item;
			await mapCache.del(key);
		}
		let res = await (getBy as unknown as { stmt: any }).stmt.execute({search});
		await resultCache(res)
		let item = await repo.instantiate.first(res) as R;
		if (item) await mapCache.set({key, value: (item as unknown as WithId).id!});
		return item;
	}
}