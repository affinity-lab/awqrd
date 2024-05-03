"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityRepository = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const util_1 = require("@affinity-lab/util");
const util_2 = require("@affinity-lab/util");
const util_3 = require("@affinity-lab/util");
const helper_1 = require("./helper");
const error_1 = require("./error");
/**
 * A generic repository class for handling CRUD operations for storm entity in a MySQL database.
 * @template DB - The type of the database connection.
 * @template SCHEMA - The type of the database schema representing the entity's table.
 * @template ENTITY - The type of the entity class.
 */
class EntityRepository {
    //endregion
    /**
     * Constructs an instance of EntityRepository.
     * @param db - The database connection.
     * @param schema - The database schema representing the entity's table.
     * @param entity - The entity class.
     */
    constructor(db, schema, entity) {
        this.db = db;
        this.schema = schema;
        this.entity = entity;
        //region Process pipelines
        this.pipelines = {
            insert: new util_3.ProcessPipeline("prepare", "action", "finalize").setup({
                prepare: ((state) => __awaiter(this, void 0, void 0, function* () {
                    state.dto = this.extractItemDTO(state.item);
                    yield this.transformInsertDTO(state.dto);
                })),
                action: ((state) => __awaiter(this, void 0, void 0, function* () {
                    yield this.db.insert(this.schema).values(state.dto).execute().then((res) => state.insertId = res[0].insertId);
                })),
                finalize: ((state) => __awaiter(this, void 0, void 0, function* () {
                    state.item.id = state.insertId;
                    yield this.reload(state.item);
                }))
            }),
            update: new util_3.ProcessPipeline("prepare", "action", "finalize").setup({
                prepare: ((state) => __awaiter(this, void 0, void 0, function* () {
                    state.dto = this.extractItemDTO(state.item);
                    yield this.transformUpdateDTO(state.dto);
                })),
                action: ((state) => __awaiter(this, void 0, void 0, function* () {
                    yield this.db.update(this.schema).set(state.dto).where((0, drizzle_orm_1.sql) `id = ${drizzle_orm_1.sql.placeholder("id")}`).execute({ id: state.item.id });
                })),
                finalize: ((state) => __awaiter(this, void 0, void 0, function* () {
                    yield this.reload(state.item);
                }))
            }),
            getOne: new util_3.ProcessPipeline("prepare", "action", "finalize").setup({
                action: ((state) => __awaiter(this, void 0, void 0, function* () {
                    if (state.dto === undefined)
                        state.dto = yield this.stmt_get({ id: state.id });
                })),
                finalize: ((state) => __awaiter(this, void 0, void 0, function* () {
                    if (state.dto !== undefined)
                        state.item = yield this.instantiate(state.dto);
                }))
            }),
            getAll: new util_3.ProcessPipeline("prepare", "action", "finalize").setup({
                action: ((state) => __awaiter(this, void 0, void 0, function* () {
                    if (state.dtos === undefined)
                        state.dtos = [];
                    state.dtos.push(...yield this.stmt_all({ ids: state.ids }));
                })),
                finalize: ((state) => __awaiter(this, void 0, void 0, function* () {
                    state.items = yield this.instantiateAll(state.dtos);
                }))
            }),
            delete: new util_3.ProcessPipeline("prepare", "action", "finalize").setup({
                action: ((state) => __awaiter(this, void 0, void 0, function* () {
                    yield this.db.delete(this.schema).where((0, drizzle_orm_1.sql) `id = (${drizzle_orm_1.sql.placeholder("id")})`).execute({ id: state.item.id });
                })),
                finalize: ((state) => {
                    state.item.id = undefined;
                })
            }),
            overwrite: new util_3.ProcessPipeline("prepare", "action", "finalize").setup({
                action: (state) => __awaiter(this, void 0, void 0, function* () {
                    yield this.db.update(this.schema).set(state.values).where((0, drizzle_orm_1.sql) `id = ${drizzle_orm_1.sql.placeholder("id")}`).execute({ id: state.item.id });
                }),
                finalize: (state) => __awaiter(this, void 0, void 0, function* () {
                    state.reload && (yield this.reload(state.item));
                })
            })
        };
        this.exec = {
            delete: (item) => __awaiter(this, void 0, void 0, function* () { return yield this.pipelines.delete.run(this, { item }); }),
            insert: (item) => __awaiter(this, void 0, void 0, function* () { return yield this.pipelines.insert.run(this, { item }).then(res => res.insertId); }),
            update: (item) => __awaiter(this, void 0, void 0, function* () { return yield this.pipelines.update.run(this, { item }); }),
            getOne: (id) => __awaiter(this, void 0, void 0, function* () { return yield this.pipelines.getOne.run(this, { id }).then(state => state.item); }),
            getAll: (ids) => __awaiter(this, void 0, void 0, function* () { return this.pipelines.getAll.run(this, { ids }).then(state => state.items); }),
            overwrite: (item_1, values_1, ...args_1) => __awaiter(this, [item_1, values_1, ...args_1], void 0, function* (item, values, reload = true) { return yield this.pipelines.overwrite.run(this, { item, values, reload }); })
        };
        this.instantiators = {
            all: (res) => this.instantiateAll(res),
            first: (res) => this.instantiateFirst(res),
        };
        this.fields = Object.keys(schema);
        this.initialize();
    }
    /**
     * Initializes the object.
     */
    initialize() { }
    //region Instantiate
    /**
     * Instantiates multiple items from an array of DTOs.
     * @param dtoSet - An array of DTOs.
     * @returns An array of instantiated items.
     */
    instantiateAll(dtoSet) {
        return __awaiter(this, void 0, void 0, function* () {
            const instances = [];
            for (let dto of dtoSet) {
                let instance = yield this.instantiate(dto);
                if (instance !== undefined)
                    instances.push(instance);
            }
            return instances;
        });
    }
    /**
     * Instantiates the first item from an array of DTOs.
     * @param dtoSet - An array of DTOs.
     * @returns The instantiated item, or undefined if the array is blank.
     */
    instantiateFirst(dtoSet) {
        return __awaiter(this, void 0, void 0, function* () { return yield this.instantiate((0, util_2.firstOrUndefined)(dtoSet)); });
    }
    /**
     * Instantiates an item from a DTO.
     * @param dto - The DTO.
     * @returns The instantiated item, or undefined if the DTO is undefined.
     */
    instantiate(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            if (dto === undefined)
                return undefined;
            let item = yield this.create();
            yield this.applyItemDTO(item, dto);
            return item;
        });
    }
    //endregion
    /**
     * Applies the data transfer object (DTO) to the item.
     * @param item The item to apply the DTO to.
     * @param dto The data transfer object (DTO) containing the data to be applied to the item.
     */
    applyItemDTO(item, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            this.transformItemDTO(dto);
            Object.assign(item, dto);
        });
    }
    /**
     * Retrieves the data transfer object (DTO) from the item.
     * @param item The item from which to retrieve the DTO.
     * @returns The DTO representing the item.
     */
    extractItemDTO(item) { return Object.assign({}, item); }
    //region DTO transform
    /**
     * Prepares the DTO for saving by filtering and omitting specified fields.
     * @param dto The DTO to prepare for saving.
     */
    transformSaveDTO(dto) {
        (0, util_2.pickFieldsIP)(dto, ...this.fields);
        (0, util_2.omitFieldsIP)(dto, "id");
    }
    /**
     * Prepares the DTO for insertion by filtering and omitting specified fields.
     * @param dto The DTO to prepare for insertion.
     */
    transformInsertDTO(dto) { this.transformSaveDTO(dto); }
    /**
     * Prepares the DTO for updating by filtering and omitting specified fields.
     * @param dto The DTO to prepare for updating.
     */
    transformUpdateDTO(dto) { this.transformSaveDTO(dto); }
    /**
     * Prepares the item DTO. This is a hook method intended for subclass overrides.
     * @param dto The DTO to prepare.
     */
    transformItemDTO(dto) { }
    //endregion
    //region Statements
    get stmt_all() { return (0, helper_1.stmt)(this.db.select().from(this.schema).where((0, drizzle_orm_1.sql) `id IN (${drizzle_orm_1.sql.placeholder("ids")})`)); }
    get stmt_get() { return (0, helper_1.stmt)(this.db.select().from(this.schema).where((0, drizzle_orm_1.sql) `id = ${drizzle_orm_1.sql.placeholder("id")}`).limit(1), util_2.firstOrUndefined); }
    //endregion
    /**
     * Retrieves raw data for an entity by its ID.
     * @param id - The ID of the entity.
     * @returns A promise resolving to the raw data of the entity, or undefined if not found.
     */
    getRaw(id) {
        return __awaiter(this, void 0, void 0, function* () { return id ? this.stmt_get({ id: id }) : undefined; });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Array.isArray(id)) {
                if (id.length === 0)
                    return [];
                id = [...new Set(id)];
                return this.exec.getAll(id);
            }
            else {
                if (id === undefined || id === null)
                    return undefined;
                return this.exec.getOne(id);
            }
        });
    }
    /**
     * Saves an item by either updating it if it already exists or inserting it if it's new.
     * @param item - The item to save.
     * @returns A promise that resolves once the save operation is completed.
     */
    save(item) {
        return __awaiter(this, void 0, void 0, function* () { return item.id ? this.update(item) : this.insert(item); });
    }
    /**
     * Updates an existing item.
     * @param item - The item to update.
     * @returns A promise that resolves once the update operation is completed.
     */
    // async update(item: Item<ENTITY>)
    // async update(item: Item<ENTITY>)
    update(item) {
        return __awaiter(this, void 0, void 0, function* () { return this.exec.update(item); });
    }
    /**
     * Inserts a new item.
     * @param item - The item to insert.
     * @returns A promise that resolves once the insert operation is completed.
     */
    // async insert(item: Item<ENTITY>) : Promise<number>;
    // async insert(values: InferInsertModel<SCHEMA>): Promise<number>;
    insert(item) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.exec.insert(item);
        });
    }
    /**
     * Overwrites an item with new values.
     * @param item - The item to overwrite.
     * @param values - The new values to overwrite the item with.
     * @param [reload=true] - Whether to reload the item after overwriting.
     * @returns A promise that resolves once the overwrite operation is completed.
     */
    overwrite(item_1, values_1) {
        return __awaiter(this, arguments, void 0, function* (item, values, reload = true) { return this.exec.overwrite(item, values, reload); });
    }
    delete(itemOrId) {
        return __awaiter(this, void 0, void 0, function* () {
            let item;
            if (typeof itemOrId === "number" || !itemOrId) {
                let instance = yield this.instantiate(yield this.getRaw(itemOrId));
                if (instance === undefined)
                    throw error_1.entityError.itemNotFound(this.constructor.name, itemOrId);
                item = instance;
            }
            else
                item = itemOrId;
            return this.exec.delete(item);
        });
    }
    /**
     * Creates a blank entity item.
     * @returns The created item.
     */
    create() {
        return __awaiter(this, void 0, void 0, function* () { return new this.entity(); });
    }
    /**
     * Reloads the item by fetching the raw data for the item's ID and applying it.
     * @param item - The item to reload.
     * @returns A promise that resolves when the item is reloaded.
     */
    reload(item) {
        return __awaiter(this, void 0, void 0, function* () { this.getRaw(item.id).then(dto => { dto && this.applyItemDTO(item, dto); }); });
    }
    ;
}
exports.EntityRepository = EntityRepository;
__decorate([
    util_1.MaterializeIt
], EntityRepository.prototype, "stmt_all", null);
__decorate([
    util_1.MaterializeIt
], EntityRepository.prototype, "stmt_get", null);
