import {MaterializeIt} from "@affinity-lab/util";
import {Import} from "../helper";
import {EntityRepositoryInterface} from "./entity-repository-interface";
import {ViewEntity} from "./view-entity";


/**
 * Class representing a storm entity.
 */
export abstract class Entity extends ViewEntity {

	static repository: EntityRepositoryInterface;
	get $repository() { return (this.constructor as typeof Entity).repository; }

	@MaterializeIt
	private static get importFields(): Array<string> | undefined { return Import.metadata.read(this)?.import;}

	/**
	 * Imports data into the entity.
	 * @param importData
	 */
	$import(importData: Record<string, any>) {
		let importFields = (this.constructor as typeof Entity).importFields;
		if (importFields) for (const key of importFields) if (importData.hasOwnProperty(key)) this[key as keyof this] = importData[key];
		return this;
	}

	/**
	 * Saves the entity to the database.
	 */
	$save() {return this.$repository.save(this);}

	/**
	 * Deletes the entity from the database.
	 */
	$delete() { return this.$repository.delete(this);}

	/**
	 * Overwrites the entity with the provided data, without validation.
	 * @param data
	 */
	$overwrite(data: Record<string, any>) { return this.$repository.overwrite(this, data);}
}
