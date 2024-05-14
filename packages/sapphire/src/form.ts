import {type MySqlTableWithColumns} from "drizzle-orm/mysql-core";
import {Column, getTableName} from "drizzle-orm";
import {type Dto, Entity, EntityRepository, type T_Class} from "@affinity-lab/storm";
import {sapphireError} from "./error";
import {type MaybeUnset} from "@affinity-lab/util";

export abstract class IForm<SCHEMA extends MySqlTableWithColumns<any>, ITEM extends Entity,ENTITY extends T_Class<ITEM, typeof Entity> = T_Class<ITEM, typeof Entity>,DTO extends Dto<SCHEMA> = Dto<SCHEMA>>{
	protected type: string;

	protected constructor(public schema: SCHEMA,
						  protected repository: EntityRepository<SCHEMA, ITEM>
	) {
		this.type = getTableName(this.schema);
	}

	protected async import(id : number | null, values: Record<string, any>): Promise<Record<string, any>> {
		for (let key of Object.keys(this.schema)) {
			let field = this.schema[key] as Column;
			if (field.dataType === "date") {
				values[key] = values[key] ? new Date(values[key]) : null;
			}
		}
		return values;
	}

	protected async export(item: ITEM | undefined, values?: Record<string, any>): Promise<{data: DTO | undefined, type: any}> {
		return {type: item?.constructor.name, data: item ? (item.$export as Function)() : {}};
	}

	public async getItem(id: number | null, values?: Record<string, any>) {
		let u = await this.repository.get(id);
		let item = id ? await this.export(u, values) : await this.newItem(values) ;
		if(!item) throw sapphireError.notFound({location: "getItem", id});
		return item;
	}

	public async save(id: number | null, values: Record<string, any> = {}): Promise<MaybeUnset<number>> {
		values = await this.import(id, values);
		let item: ITEM | undefined;
		if(!id) item = await this.repository.create();
		else item = await this.repository.get(id);
		if(!item) throw sapphireError.notFound({location: "saveItem", id});
		item.$import(values);
		await item.$save();
		return item.id;
	}

	protected abstract newItem(values?: Record<string, any>): Promise<{type: string, data: Partial<DTO> & Record<string, any>}>;

	async delete(id: number) {await this.repository.delete(id);}

	// async file(id: number, collectionName: string, files: Array<TmpFile>) {
	// 	let collection: Collection<any> | undefined = undefined;
	// 	for (let c of this.repository.files) if (c.name === collectionName) collection = c;
	// 	if (!collection) return "collection doesn't exist!";
	// 	if (files) for (let file of files) await collection.add(id, file);
	// 	else return "No files were given!";
	// 	return "done";
	// }
	//
	// async collection(id: number) {
	// 	let collections = [];
	// 	for (let collection of this.repository.files) {
	// 		let files = await collection.get(id);
	// 		collections.push({
	// 			name: collection.name,
	// 			items: files,
	// 			publicMetaFields: collection.publicMetaFields,
	// 			rules: collection.rules
	// 		});
	// 	}
	// 	return collections;
	// }
	//
	// async changeFileData(id: number, collectionName: string, fileName: string, newMetaData?: Record<string, any>, newName?: string) {
	// 	let collection: Collection<any> | undefined = undefined;
	// 	for (let c of this.repository.files) if (c.name === collectionName) collection = c;
	// 	if (!collection) return "collection doesn't exist!";
	// 	if (newMetaData) await collection.setMetadata(id, fileName, newMetaData);
	// 	if (newName) {
	// 		let ext = Path.extname(fileName);
	// 		newName = newName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
	// 		if ((fileName.split('.')[0] !== newName.split('.')[0]) || (Path.extname(newName) !== ext && Path.extname(newName) !== '')) {
	// 			if (Path.extname(newName) !== ext) {
	// 				console.log(fileName, ext, newName)
	// 				newName += ext;
	// 			}
	// 			await collection.rename(id, fileName, newName);
	// 		}
	// 	}
	// 	return "done";
	// }
	//
	// async deleteFile(id: number, collectionName: string, fileName: string) {
	// 	let collection: Collection<any> | undefined = undefined;
	// 	for (let c of this.repository.files) if (c.name === collectionName) collection = c;
	// 	if (!collection) return "collection doesn't exist!";
	// 	await collection.delete(id, fileName);
	// 	return "done";
	// }
	//
	// async changeFileOrder(id: number, collectionName: string, fileName: string,  position: number) {
	// 	let collection: Collection<any> | undefined = undefined;
	// 	for (let c of this.repository.files) if (c.name === collectionName) collection = c;
	// 	if (!collection) return "collection doesn't exist!";
	// 	await collection.setPosition(id, fileName, position);
	// 	return "done";
	// }


}
