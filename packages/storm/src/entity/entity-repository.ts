import type {MaybePromise, T_Class} from "@affinity-lab/util";
import {omitFieldsIP, pickFieldsIP, ProcessPipeline, type State} from "@affinity-lab/util";
import {sql} from "drizzle-orm";
import {MySqlTableWithColumns} from "drizzle-orm/mysql-core";
import type {MySqlRawQueryResult} from "drizzle-orm/mysql2";
import type {Dto} from "../types";
import {Entity} from "./entity";
import type {EntityRepositoryInterface} from "./entity-repository-interface";
import {ViewEntityRepository} from "./view-entity-repository";


/**
 * A generic repository class for handling CRUD operations for storm entity in a MySQL database.
 * @template SCHEMA - The type of the database schema representing the entity's table.
 * @template ITEM - The type of the entity class.
 **/
export class EntityRepository<
	SCHEMA extends MySqlTableWithColumns<any>,
	ITEM extends Entity,
	ENTITY extends T_Class<ITEM, typeof Entity> = T_Class<ITEM, typeof Entity>,
	DTO extends Dto<SCHEMA> = Dto<SCHEMA>
>
	extends ViewEntityRepository<SCHEMA, ITEM, ENTITY, DTO>
	implements EntityRepositoryInterface<SCHEMA, ITEM, ENTITY, DTO> {

	protected pipelineFactory() {
		return {
			...super.pipelineFactory(),
			insert: new ProcessPipeline("prepare", "action", "finalize").setup({
				prepare: (async (state: State<{ item: ITEM }>) => {
					state.dto = await this.getInsertDTO(state.dto)
				}),
				action: (async (state: State) => {
					await this.db.insert(this.schema).values(state.dto).execute().then((res: MySqlRawQueryResult) => state.insertId = res[0].insertId)
				}),
				finalize: (async (state: State) => {
					state.item.id = state.insertId
					await this.reload(state.item)
				})
			}),
			update: new ProcessPipeline("prepare", "action", "finalize").setup({
				prepare: (async (state: State) => {
					state.dto = await this.getUpdateDTO(state.dto)
				}),
				action: (async (state: State) => {
					await this.db.update(this.schema).set(state.dto).where(sql`id = ${sql.placeholder("id")}`).execute({id: state.item.id})
				}),
				finalize: (async (state: State) => {
					await this.reload(state.item)
				})
			}),

			delete: new ProcessPipeline("prepare", "action", "finalize").setup({
				action: (async (state: State) => {
					await this.db.delete(this.schema).where(sql`id = (${sql.placeholder("id")})`).execute({id: state.item.id})
				}),
				finalize: ((state: State) => {
					state.item.id = undefined
				})
			}),
			overwrite: new ProcessPipeline("prepare", "action", "finalize").setup({
				action: async (state: State) => {
					await this.db.update(this.schema).set(state.values as DTO).where(sql`id = ${sql.placeholder("id")}`).execute({id: state.item.id})
				},
				finalize: async (state: State) => {
					state.reload && await this.reload(state.item)
				}
			})
		};
	};
	protected pipelineExecFactory() {
		return {
			...super.pipelineExecFactory(),
			delete: async (item: ITEM) => {return await this.pipelines.delete.run(this, {item})},
			insert: async (item: ITEM) => {return await this.pipelines.insert.run(this, {item}).then(res => res.insertId as number)},
			update: async (item: ITEM) => {return await this.pipelines.update.run(this, {item})},
			overwrite: async (item: ITEM, values: Record<string, any>, reload: boolean = true) => { return await this.pipelines.overwrite.run(this, {item, values, reload})}
		}
	}
	public readonly pipelines = this.pipelineFactory();
	protected readonly exec = this.pipelineExecFactory();

	/**
	 * Retrieves the data transfer object (DTO) from the item.
	 * @param item The item from which to retrieve the DTO.
	 * @returns The DTO representing the item.
	 */
	protected extractItemDTO(item: ITEM): DTO {return Object.assign({}, item) as unknown as DTO;}
	protected async getInsertDTO(item: ITEM): Promise<DTO> {
		let dto = this.extractItemDTO(item);
		await this.transformInsertDTO(dto);
		return dto
	}
	protected async getUpdateDTO(item: ITEM): Promise<DTO> {
		let dto = this.extractItemDTO(item);
		await this.transformUpdateDTO(dto);
		return dto
	}
	/**
	 * Prepares the DTO for saving by filtering and omitting specified fields.
	 * @param dto The DTO to prepare for saving.
	 */
	protected transformSaveDTO(dto: DTO): MaybePromise<void> {
		pickFieldsIP(dto, ...this.fields);
		omitFieldsIP(dto, "id");
	}
	/**
	 * Prepares the DTO for insertion by filtering and omitting specified fields.
	 * @param dto The DTO to prepare for insertion.
	 */
	protected transformInsertDTO(dto: DTO): MaybePromise<void> {this.transformSaveDTO(dto);}
	/**
	 * Prepares the DTO for updating by filtering and omitting specified fields.
	 * @param dto The DTO to prepare for updating.
	 */
	protected transformUpdateDTO(dto: DTO): MaybePromise<void> {this.transformSaveDTO(dto);}

	/**
	 * Creates a new item.
	 * @param importData - initial data to import into the new item.
	 * @returns A promise that resolves to the new item.
	 */
	public async create(importData?: Record<string, any>): Promise<ITEM> {
		let item = new this.entity(this as EntityRepositoryInterface);
		if (importData) item.$import(importData);
		return item;
	}

	/**
	 * Saves an item by either updating it if it already exists or inserting it if it's new.
	 * @param item - The item to save.
	 * @returns A promise that resolves once the save operation is completed.
	 */
	public async save(item: ITEM) {return item.id ? this.update(item) : this.insert(item)}

	/**
	 * Updates an existing item.
	 * @param item - The item to update.
	 * @returns A promise that resolves once the update operation is completed.
	 */
	public async update(item: ITEM) { return this.exec.update(item) }

	/**
	 * Inserts a new item.
	 * @param item - The item to insert.
	 * @returns A promise that resolves once the insert operation is completed.
	 */
	public async insert(item: ITEM) { return this.exec.insert(item)}

	/**
	 * Overwrites an item with new values.
	 * @param item - The item to overwrite.
	 * @param values - The new values to overwrite the item with.
	 * @param [reload=true] - Whether to reload the item after overwriting.
	 * @returns A promise that resolves once the overwrite operation is completed.
	 */
	public async overwrite(item: ITEM, values: Record<string, any>, reload: boolean = true) { return this.exec.overwrite(item, values, reload)}

	/**
	 * Deletes an item.
	 * @param item - The item to delete.
	 * @returns A promise that resolves once the delete operation is completed.
	 */
	public async delete(item: ITEM) { return this.exec.delete(item);}
}
