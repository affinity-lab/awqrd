import {MaterializeIt, type MaybeNull} from "@affinity-lab/util";
import {omitFieldsIP, pickFieldsIP} from "@affinity-lab/util";
import {Export} from "./export";
import {EntityRepository} from "./entity-repository";
import {Import} from "./import";

/**
 * Class representing a storm entity.
 */
export class Entity {

	@Export id: MaybeNull<number> = null;


	constructor(private $repository: EntityRepository<any, any>) {}

	$save() {
		return this.$repository.save(this);
	}

	$delete() {
		return this.$repository.delete(this);
	}

	$overwrite(data: Record<string, any>) {
		return this.$repository.overwrite(this, data);
	}

	$import(data: Record<string, any>) {
		let a = Object.getPrototypeOf(this).constructor.importFields;
		if (a) for (const key of a) if(data.hasOwnProperty(key)) this[key as keyof this] = data[key];
		return this;
	}

	@MaterializeIt
	private static get importFields(): Array<string> | undefined {
		return Import.metadata.read(this)?.import;
	}

	@MaterializeIt
	private static get exportFields(): Array<string> | undefined {
		return Export.metadata.read(this)?.export;
	}

	$export() {
		const e: Record<string, any> = {}
		let a = Object.getPrototypeOf(this).constructor.exportFields;
		if (a) for (const key of a) e[key] = this[key as keyof this];
		return e
	}

	$pick(...fields: string[]) {
		let res = this.$export();
		pickFieldsIP(res, ...fields);
		return res;
	}

	$omit(...fields: string[]) {
		let res = this.$export();
		omitFieldsIP(res, ...fields);
		return res;
	}

	toJSON() {
		return this.$export();
	}
}


