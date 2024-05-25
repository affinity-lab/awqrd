import {EntityRepositoryInterface} from "@affinity-lab/storm";
import type {State} from "@affinity-lab/util";
import {Storage} from "../storage";

/**
 * Storage plugin
 * @param repository
 * @param storage
 */
export function storagePlugin(repository: EntityRepositoryInterface, storage: Storage) {
	repository.pipelines.delete.blocks
		.finalize.append(async (state: State<{ item: { id: number } }>) => {
			storage.destroy(repository, state.item.id);
		}
	)
}