import {unflatten} from "uni-flatten";


type Constructor = (new () => Object) | Function;
type ClassMetaDataStore = Record<string, SingleStore | ArrayStore>;

class ObjectStore {public value: Record<string, any> = {};}
class SingleStore {public value: any;}
class ArrayStore {public value: any[] = [];}

/**
 * Class to store metadata for a class
 * @class MetaDataStore
 */
export class MetaDataStore {
	/**
	 * @type {ClassMetaDataStore}
	 * @description The metadata records
	 */
	records: ClassMetaDataStore = {};

	/**
	 * @constructor
	 * @param target
	 */
	constructor(readonly target: Constructor) {}

	/**
	 * Merge metadata
	 * @param key
	 * @param value
	 */
	merge(key: string | string[], value: Record<string, any>) {
		key = this.key(key);
		if (!this.records.hasOwnProperty(key)) this.records[key] = new ObjectStore();
		if (!(this.records[key] instanceof ObjectStore)) throw `Metadata ${key} on ${this.target} type mismatch error!`;
		this.records[key].value = {...(this.records[key].value), ...value};
	}
	/**
	 * Set metadata
	 * @param key
	 * @param value
	 */
	set(key: string | string[], value: any) {
		key = this.key(key);
		if (!this.records.hasOwnProperty(key)) this.records[key] = new SingleStore();
		if (!(this.records[key] instanceof SingleStore)) throw `Metadata ${key} on ${this.target} type mismatch error!`;
		this.records[key].value = value;
	}
	/**
	 * Push metadata
	 * @param key
	 * @param value
	 */
	push(key: string | string[], value: any) {
		key = this.key(key);
		if (!this.records.hasOwnProperty(key)) this.records[key] = new ArrayStore();
		if (!(this.records[key] instanceof ArrayStore)) throw `Metadata ${key} on ${this.target} type mismatch error!`;
		this.records[key].value.push(value);
	}
	/**
	 * Delete metadata
	 * @param key
	 */
	delete(key: string | string[]) { delete (this.records[this.key(key)]);}
	private key(key: string | string[]) {return Array.isArray(key) ? key.join(".") : key;}
}

/**
 * Class to store metadata for classes
 */
export class MetaValue{
	readonly self: any = undefined;
	readonly inherited: Array<any> = [];
	public value: any;
	constructor(readonly store: ObjectStore | SingleStore | ArrayStore, self: boolean = false) {
		if(this.store instanceof ArrayStore){
			this.value = [...store.value];
			if (self) this.self = [...store.value];
		}  else if (this.store instanceof ObjectStore) {
			this.value = {...store.value};
			if (self) this.self = {...store.value};
		} else {
			this.value = store.value;
			if(self) this.self = store.value;
		}
		this.inherited.push(store.value);
	}

	addInherited(value: any) {
		this.inherited.push(value);
		if(this.store instanceof ArrayStore) this.value.push(...value)
		else if (this.store instanceof ObjectStore) Object.assign(this.value, value);
	}
}

/**
 * Class to store metadata for classes
 */
export class ClassMetaData {
	/**
	 * @type {Array<MetaDataStore>} stores - The metadata stores
	 */
	stores: Array<MetaDataStore> = [];

	constructor() {}
	/**
	 * Get metadata for a class
	 * @param target
	 */
	get(target: Constructor): MetaDataStore | undefined ;
	get(target: Constructor, create: false): MetaDataStore | undefined ;
	get(target: Constructor, create: true): MetaDataStore ;
	get(target: Constructor, create: boolean = false): MetaDataStore | undefined {
		for (const store of this.stores) if (store.target === target) return store;
		const store = new MetaDataStore(target);
		if (create) this.stores.push(store);
		return store;
	}
	/**
	 * Read metadata for a class
	 * @param target
	 * @param options
	 */
	read(target: Constructor, options: { flatten?: boolean, simple?: boolean } = {}): undefined | Record<string, any> {
		options = {...{flatten: false, simple: true}, ...options};
		const result: Record<string, MetaValue> = {};
		let store = this.get(target);

		if (store !== undefined) {
			for (const key in store.records) {
				result[key] = new MetaValue(store.records[key], true);
			}
		}

		target = Object.getPrototypeOf(target);
		while (target !== Object.prototype) {
			store = this.get(target);
			if (store !== undefined) {
				for (const key in store.records) {
					if (result.hasOwnProperty(key)) {
						result[key].addInherited(store.records[key].value);
					} else {
						result[key] = new MetaValue(store.records[key]);
					}
				}
			}
			target = Object.getPrototypeOf(target);
		}

		if (options.simple) {
			for (const key in result) {
				result[key] = result[key].value;
			}
		}

		return options.flatten ? result : unflatten(result);
	}
}
