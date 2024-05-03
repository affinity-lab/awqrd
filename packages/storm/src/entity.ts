import {MaterializeIt} from "@affinity-lab/util";
import {omitFieldsIP, pickFieldsIP} from "@affinity-lab/util";
import {type MaybeUnset} from "@affinity-lab/util";
import {Export} from "./export";

/**
 * Class representing a storm entity.
 */
export class Entity {
	/** The ID of the entity. */
	@Export declare id: MaybeUnset<number>;

	@MaterializeIt
	private static get exportFields(): Array<string> | undefined {
		return Export.metadata.read(this.constructor)?.export;
	}

	$export() {
		const e: Record<string, any> = {}
		let a = this.constructor.prototype.exportFields;
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
}


