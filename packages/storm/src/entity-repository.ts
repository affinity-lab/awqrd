import {sql} from "drizzle-orm";
import {MySqlTableWithColumns} from "drizzle-orm/mysql-core";
import type {MySql2Database, MySqlRawQueryResult} from "drizzle-orm/mysql2";
import {MaterializeIt} from "@affinity-lab/util";
import {firstOrUndefined, omitFieldsIP, pickFieldsIP} from "@affinity-lab/util";
import {ProcessPipeline, type State} from "@affinity-lab/util";
import type {MaybePromise, MaybeUndefined, MaybeUnset} from "@affinity-lab/util";
import type {IEntityRepository} from "./entity-repository-interface";
import {Entity} from "./entity";
import {stmt} from "./helper";
import type {Dto, T_Class, WithId, WithIds} from "./types";
import {entityError} from "./error";


/**
 * A generic repository class for handling CRUD operations for storm entity in a MySQL database.
 * @template DB - The type of the database connection.
 * @template SCHEMA - The type of the database schema representing the entity's table.
 * @template ENTITY - The type of the entity class.
 */
export class EntityRepository<
	SCHEMA extends MySqlTableWithColumns<any>,
	ITEM extends Entity,
	ENTITY extends T_Class<ITEM, typeof Entity> = T_Class<ITEM, typeof Entity>,
	DTO extends Dto<SCHEMA> = Dto<SCHEMA>
> implements IEntityRepository {
	readonly fields: string[];

//region Process pipelines

	public readonly pipelines = {
		insert: new ProcessPipeline("prepare", "action", "finalize").setup({
			prepare: (async (state: State<{ item: ITEM }>) => {
				state.dto = this.extractItemDTO(state.item)
				await this.transformInsertDTO(state.dto)
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
				state.dto = this.extractItemDTO(state.item)
				await this.transformUpdateDTO(state.dto)
			}),
			action: (async (state: State) => {
				await this.db.update(this.schema).set(state.dto).where(sql`id = ${sql.placeholder("id")}`).execute({id: state.item.id})
			}),
			finalize: (async (state: State) => {
				await this.reload(state.item)
			})
		}),
		getOne: new ProcessPipeline("prepare", "action", "finalize").setup({
			action: (async (state: State) => {
				if (state.dto === undefined) state.dto = await this.stmt_get({id: state.id})
			}),
			finalize: (async (state: State) => {
				if (state.dto !== undefined) state.item = await this.instantiate(state.dto)
			})
		}),
		getArray: new ProcessPipeline("prepare", "action", "finalize").setup({
			action: (async (state: State) => {
				if (state.dtos === undefined) state.dtos = [];
				state.dtos.push(...await this.stmt_get_array({ids: state.ids}));
			}),
			finalize: (async (state: State) => {
				state.items = await this.instantiateAll(state.dtos)
			})
		}),
		getAll: new ProcessPipeline("prepare", "action", "finalize").setup({
			action: (async (state: State) => {
				if (state.dtos === undefined) state.dtos = [];
				state.dtos.push(...await this.stmt_all());
			}),
			finalize: (async (state: State) => {
				state.items = await this.instantiateAll(state.dtos)
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
	}

	protected exec = {
		delete: async (item: ITEM) => {return await this.pipelines.delete.run(this, {item})},
		insert: async (item: ITEM) => {return await this.pipelines.insert.run(this, {item}).then(res => res.insertId as number)},
		update: async (item: ITEM) => {return await this.pipelines.update.run(this, {item})},
		getOne: async (id: number) => {return await this.pipelines.getOne.run(this, {id}).then(state => state.item)},
		getArray: async (ids: Array<number>) => { return this.pipelines.getAll.run(this, {ids}).then(state => state.items)},
		getAll: async () => { return this.pipelines.getAll.run(this, {}).then(state => state.items)},
		overwrite: async (item: ITEM, values: Record<string, any>, reload: boolean = true) => { return await this.pipelines.overwrite.run(this, {item, values, reload})}
	}


//endregion

	/**
	 * Constructs an instance of EntityRepository.
	 * @param db - The database connection.
	 * @param schema - The database schema representing the entity's table.
	 * @param entity - The entity class.
	 */
	constructor(readonly db: MySql2Database<any>, readonly schema: SCHEMA, readonly entity: ENTITY) {
		this.fields = Object.keys(schema);
		this.initialize();
	}


	/**
	 * Initializes the object.
	 */
	protected initialize() {}


//region Instantiate

	/**
	 * Instantiates multiple items from an array of DTOs.
	 * @param dtoSet - An array of DTOs.
	 * @returns An array of instantiated items.
	 */
	protected async instantiateAll(dtoSet: Array<Record<string, any>>): Promise<Array<ITEM>> {
		const instances: Array<ITEM> = [];
		for (let dto of dtoSet) {
			let instance = await this.instantiate(dto as DTO) as ITEM | undefined;
			if (instance !== undefined) instances.push(instance)
		}
		return instances;
	}

	/**
	 * Instantiates the first item from an array of DTOs.
	 * @param dtoSet - An array of DTOs.
	 * @returns The instantiated item, or undefined if the array is blank.
	 */
	protected async instantiateFirst(dtoSet: Array<Record<string, any>>): Promise<MaybeUndefined<ITEM>> { return await this.instantiate(firstOrUndefined(dtoSet)) as ITEM | undefined;}

	/**
	 * Instantiates an item from a DTO.
	 * @param dto - The DTO.
	 * @returns The instantiated item, or undefined if the DTO is undefined.
	 */
	protected async instantiate(dto: DTO | undefined) {
		if (dto === undefined) return undefined;
		let item = await this.create();
		await this.applyItemDTO(item, dto);
		return item;
	}

	public instantiators = {
		all: (res: any) => this.instantiateAll(res),
		first: (res: any) => this.instantiateFirst(res),
	}


//endregion

	/**
	 * Applies the data transfer object (DTO) to the item.
	 * @param item The item to apply the DTO to.
	 * @param dto The data transfer object (DTO) containing the data to be applied to the item.
	 */
	protected async applyItemDTO(item: ITEM, dto: DTO) {
		this.transformItemDTO(dto);
		Object.assign(item, dto);
	}

	/**
	 * Retrieves the data transfer object (DTO) from the item.
	 * @param item The item from which to retrieve the DTO.
	 * @returns The DTO representing the item.
	 */
	protected extractItemDTO(item: ITEM): DTO {return Object.assign({}, item) as unknown as DTO;}

//region DTO transform

	/**
	 * Prepares the DTO for saving by filtering and omitting specified fields.
	 * @param dto The DTO to prepare for saving.
	 */
	protected transformSaveDTO(dto: DTO) {
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
	 * Prepares the item DTO. This is a hook method intended for subclass overrides.
	 * @param dto The DTO to prepare.
	 */
	protected transformItemDTO(dto: DTO): MaybePromise<void> {}

//endregion

//region Statements

	@MaterializeIt
	protected get stmt_all() { return stmt<Array<DTO>>(this.db.select().from(this.schema))}
	@MaterializeIt
	protected get stmt_get_array() { return stmt<WithIds, Array<DTO>>(this.db.select().from(this.schema).where(sql`id IN (${sql.placeholder("ids")})`))}
	@MaterializeIt
	protected get stmt_get() { return stmt<WithId, MaybeUndefined<DTO>>(this.db.select().from(this.schema).where(sql`id = ${sql.placeholder("id")}`).limit(1), firstOrUndefined)}

	//endregion

	/**
	 * Retrieves raw data for an entity by its ID.
	 * @param id - The ID of the entity.
	 * @returns A promise resolving to the raw data of the entity, or undefined if not found.
	 */
	async getRaw(id: MaybeUnset<number>): Promise<MaybeUndefined<DTO>> { return id ? this.stmt_get({id: id!}) : undefined}

	/**
	 * Retrieves one or multiple items by their IDs.
	 * @param id - The ID or array of IDs of the item(s) to retrieve.
	 * @returns A promise resolving to one or multiple items, or undefined if not found.
	 * @final
	 */
	get(): Promise<Array<WithId<ITEM>>>
	get(id: Array<number>): Promise<Array<WithId<ITEM>>>
	get(ids: MaybeUnset<number>): Promise<WithId<ITEM> | undefined>
	async get(id?: Array<number> | number | undefined | null) {
		if(arguments.length === 0) return this.exec.getAll();
		if (Array.isArray(id)) {
			if (id.length === 0) return [];
			id = [...new Set(id)];
			return this.exec.getArray(id)
		} else {
			if (id === undefined || id === null) return undefined;
			return this.exec.getOne(id)
		}
	}

	/**
	 * Saves an item by either updating it if it already exists or inserting it if it's new.
	 * @param item - The item to save.
	 * @returns A promise that resolves once the save operation is completed.
	 */
	async save(item: ITEM) {return item.id ? this.update(item) : this.insert(item)}

	/**
	 * Updates an existing item.
	 * @param item - The item to update.
	 * @returns A promise that resolves once the update operation is completed.
	 */
	async update(item: ITEM) { return this.exec.update(item) }

	/**
	 * Inserts a new item.
	 * @param item - The item to insert.
	 * @returns A promise that resolves once the insert operation is completed.
	 */
	async insert(item: ITEM) { // TODO
		return this.exec.insert(item)
	}

	/**
	 * Overwrites an item with new values.
	 * @param item - The item to overwrite.
	 * @param values - The new values to overwrite the item with.
	 * @param [reload=true] - Whether to reload the item after overwriting.
	 * @returns A promise that resolves once the overwrite operation is completed.
	 */
	async overwrite(item: ITEM, values: Record<string, any>, reload: boolean = true) { return this.exec.overwrite(item, values, reload)}

	/**
	 * Deletes an item.
	 * @param item - The item to delete.
	 * @returns A promise that resolves once the delete operation is completed.
	 */
	async delete(item: ITEM): Promise<Record<string, any>>;
	async delete(id: number | undefined | null): Promise<Record<string, any>>;
	async delete(itemOrId: ITEM | number | undefined | null) {
		let item;
		if (typeof itemOrId === "number" || !itemOrId) {
			let instance = await this.instantiate(await this.getRaw(itemOrId));
			if(instance === undefined) throw entityError.itemNotFound(this.constructor.name, itemOrId);
			item = instance;
		} else item = itemOrId;
		return this.exec.delete(item);
	}

	/**
	 * Creates a blank entity item.
	 * @returns The created item.
	 */
	async create(importData?: Record<string, any>): Promise<ITEM> {
		let item = new this.entity(this);
		if(importData) item.$import(importData);
		return item;
	}

	/**
	 * Reloads the item by fetching the raw data for the item's ID and applying it.
	 * @param item - The item to reload.
	 * @returns A promise that resolves when the item is reloaded.
	 */
	async reload(item: ITEM) { this.getRaw(item.id).then(dto => { dto && this.applyItemDTO(item, dto!)})};

}

