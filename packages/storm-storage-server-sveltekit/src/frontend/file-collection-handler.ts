import {Collection, FileCollection} from "./types";

export class FileCollectionHandler<METADATA extends Record<string, any> = Record<string, any>> {

	static create<MD extends Record<string, any> = Record<string, any>, T extends typeof FileCollectionHandler<MD> = typeof FileCollectionHandler<MD>>(this: T, collection: Collection<MD>): InstanceType<T>
	static create<MD extends Record<string, any> = Record<string, any>, T extends typeof FileCollectionHandler<MD> = typeof FileCollectionHandler<MD>>(this: T, collection: undefined): undefined
	static create<
		MD extends Record<string, any> = Record<string, any>,
		T extends typeof FileCollectionHandler<MD> = typeof FileCollectionHandler<MD>
	>(this: T, collection: Collection<MD> | undefined): InstanceType<T> | undefined {
		if (collection === undefined) return undefined;
		return new this(collection!) as InstanceType<T>;
	}

	public collection: FileCollection<METADATA>;

	static fileUrlPrefix = "/file";
	protected fileUrlPrefix: string;


	constructor(collection: Collection<METADATA>) {
		this.fileUrlPrefix = (this.constructor as typeof FileCollectionHandler).fileUrlPrefix;

		this.collection = structuredClone(collection) as FileCollection<METADATA>;

		this.collection.files.forEach(file => {
			let id = collection.id.toString(36).padStart(6, "0");
			file.url = this.fileUrlPrefix + "/" + collection.collection + "/" + `${id.slice(0, 2)}/${id.slice(2, 4)}/${id.slice(4, 6)}` + "/" + file.name;
		});
	}

	get files(): Array<FileCollection<METADATA>['files'][number]> { return this.collection.files }
	get id() { return this.collection.id }
	get rules() { return this.collection.rules }
	get collectionName() { return this.collection.collection }
}