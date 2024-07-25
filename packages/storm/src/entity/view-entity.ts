import {MaterializeIt, MaybeNull, omitFieldsIP, pickFieldsIP} from "@affinity-lab/util";
import {entityError} from "../error";
import {Export} from "../helper";
import {ViewEntityRepositoryInterface} from "./view-entity-repository-interface";


/**
 * Class representing a storm view entity.
 */
export abstract class ViewEntity {

	static repository: ViewEntityRepositoryInterface;
	get $repository() { return (this.constructor as typeof ViewEntity).repository; }

	@Export id: MaybeNull<number> = null;

	get $id(): number {
		if (this.id) return this.id;
		throw entityError.itemNotExists()
	}

	constructor() {}

	@MaterializeIt
	private static get exportFields(): Array<string> | undefined { return Export.metadata.read(this)?.export;}

	/**
	 * Exports the entity to a plain object for exporting.
	 * @returns A plain object representation of the entity.
	 */
	$export() {
		const e: Record<string, any> = {}
		let a = (this.constructor as typeof ViewEntity).exportFields;


		if (a) for (const key of a) {
			e[key] = (
				typeof this[key as keyof this] === 'object' &&
				typeof (this[key as keyof this] as { toJSON?: () => any })["toJSON"] === "function"
			)
				? (this[key as keyof this] as { toJSON: () => any }).toJSON()
				: this[key as keyof this];
		}
		return e
	}

	/**
	 * Picks specified fields from export.
	 * @param fields
	 */
	$pick(...fields: string[]) {
		let res = this.$export();
		pickFieldsIP(res, ...fields);
		return res;
	}

	/**
	 * Omits specified fields from export.
	 * @param fields
	 */
	$omit(...fields: string[]) {
		let res = this.$export();
		omitFieldsIP(res, ...fields);
		return res;
	}

	/**
	 * Returns a JSON representation of the entity.
	 * @returns A JSON representation of the entity.
	 */
	toJSON() { return this.$export(); }

	/**
	 * Returns a string representation of the entity.
	 * @returns A string representation of the entity.
	 */
	toString() { return `${this.constructor.name}(${this.id})`; }
}