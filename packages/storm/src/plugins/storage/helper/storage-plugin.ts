import type {State} from "@affinity-lab/awqrd-util";
import {EntityRepository} from "../../../entity-repository";
import {Storage} from "../storage";

export function storagePlugin(repository: EntityRepository<any, any, any>, storage: Storage) {
	repository.pipelines.delete.blocks
		.finalize.append(async (state: State<{ item: { id: number } }>) => {
			storage.destroy(repository, state.item.id);
		}
	)
}