import {Attachment, Collection, type Dto, Entity, EntityRepositoryInterface, Storage} from "@affinity-lab/storm";
import {type MaybeUnset, T_Class, TmpFile} from "@affinity-lab/util";
import {Column, getTableName} from "drizzle-orm";
import {type MySqlTableWithColumns} from "drizzle-orm/mysql-core";
import {sapphireError} from "./error";


export abstract class IForm<
	SCHEMA extends MySqlTableWithColumns<any>,
	ITEM extends Entity,
	ENTITY extends T_Class<ITEM, typeof Entity> = T_Class<ITEM, typeof Entity>,
	DTO extends Dto<SCHEMA> = Dto<SCHEMA>
> {
	protected type: string;

	protected constructor(public schema: SCHEMA,
						  protected repository: EntityRepositoryInterface,
						  protected storage: Storage
	) {
		this.type = getTableName(this.schema);
	}

	protected async import(id: number | null, values: Record<string, any>): Promise<Record<string, any>> {
		for (let key of Object.keys(this.schema)) {
			let field = this.schema[key] as Column;
			if (field.dataType === "date") {
				values[key] = values[key] ? new Date(values[key]) : null;
			}
		}
		return values;
	}

	protected async export(item: ITEM | undefined, values?: Record<string, any>): Promise<{ data: DTO | undefined, type: any }> {
		return {type: item?.constructor.name, data: item ? (item.$export as Function)() : {}};
	}

	public async getItem(id: number | null, values?: Record<string, any>) {
		let u = await this.repository.get(id);
		let item = id ? await this.export(u, values) : await this.newItem(values);
		if (!item) throw sapphireError.notFound({location: "getItem", id});
		return item;
	}

	public async save(id: number | null, values: Record<string, any> = {}): Promise<MaybeUnset<number>> {
		values = await this.import(id, values);
		let item: ITEM | undefined;
		if (!id) item = await this.repository.create();
		else item = await this.repository.get(id);
		if (!item) throw sapphireError.notFound({location: "saveItem", id});
		item.$import(values);
		await item.$save();
		return item.id;
	}

	protected abstract newItem(values?: Record<string, any>): Promise<{ type: string, data: Partial<DTO> & Record<string, any> }>;

	async delete(id: number) {
		await this.repository.delete(await this.repository.get(id));
	}

	async file(id: number, collectionName: string, files: Array<TmpFile>) {
		let item = await this.repository.get(id);
		let collection: Collection<any> | undefined = this.storage.collections[collectionName];
		if (!collection) throw sapphireError.collectionNotExist(collectionName);
		if (files) for (let file of files) await collection.handler(item)?.add(file);
		else throw sapphireError.fileNotProvided();
	}

	async collection(id: number) {
		let collections = [];
		for (let key in this.storage.groups) {
			let group = this.storage.groups[key];
			if(group.repository === this.repository) {
				for (let key in group.collections) {
					let collection = group.collections[key];
					let files = await collection.get(id);
					collections.push({
						name: collection.name,
						items: files,
						publicMetaFields: collection.writableMetaFields,
						rules: {...collection.rules, limit: collection.rules.limit.count}
					});
				}
			}
		}
		return collections;
	}

	async changeFileData(id: number, collectionName: string, fileName: string, newMetaData?: Record<string, any>, newName?: string) {
		let collection: Collection<any> | undefined = this.storage.collections[collectionName];
		if (!collection) throw sapphireError.collectionNotExist(collectionName);
		let item = await this.repository.get(id);
		for(let file of collection.handler(item) || []) {
			if(newMetaData) file.metadata = newMetaData;
			if(newName) await file.rename(newName);
		}
	}

	protected async findFile(id: number, collectionName: string, fileName: string): Promise<Attachment<any>> {
		let collection: Collection<any> | undefined = this.storage.collections[collectionName];
		if (!collection) throw sapphireError.collectionNotExist(collectionName);
		let item = await this.repository.get(id);
		let handler = collection.handler(item);
		if(!handler) throw sapphireError.notFound({type: "handler"});
		let file = handler.findFile(fileName);
		if(!file) throw sapphireError.notFound({type: "file"});
		return file;
	}

	async deleteFile(id: number, collectionName: string, fileName: string) {
		let file = await this.findFile(id, collectionName, fileName);
		await file.delete();
	}

	async changeFileOrder(id: number, collectionName: string, fileName: string, position: number) {
		let file = await this.findFile(id, collectionName, fileName);
		await file.setPositions(position);
	}


}
