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
exports.GroupTagRepository = exports.GroupTagEntity = void 0;
const tag_repository_1 = require("./tag-repository");
const drizzle_orm_1 = require("drizzle-orm");
const awqrd_util_1 = require("@affinity-lab/awqrd-util");
const helper_1 = require("../../helper");
const error_1 = require("./helper/error");
const export_1 = require("../../export");
class GroupTagEntity extends tag_repository_1.TagEntity {
    constructor() {
        super(...arguments);
        this.groupId = null;
    }
}
exports.GroupTagEntity = GroupTagEntity;
__decorate([
    export_1.Export
], GroupTagEntity.prototype, "groupId", void 0);
// TODO test this
class GroupTagRepository extends tag_repository_1.TagRepository {
    // the fieldName property must match the GroupTagEntity's (groupId) field name
    // if you make a new Entity don't forget to add provide the field name in the constructor
    constructor(db, schema, entity, fieldName = "groupId") {
        super(db, schema, entity);
        this.db = db;
        this.schema = schema;
        this.entity = entity;
        this.fieldName = fieldName;
    }
    get stmt_groupGetByName() {
        return (0, helper_1.stmt)(this.db.select().from(this.schema).where((0, drizzle_orm_1.sql) `name IN (${drizzle_orm_1.sql.placeholder("names")}) AND ${this.fieldName} = ${drizzle_orm_1.sql.placeholder("groupId")}`));
    }
    getByName(names, groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!groupId)
                throw error_1.tagError.groupId();
            let isArray = Array.isArray(names);
            if (typeof names === "string")
                names = [names];
            if (names.length === 0)
                return isArray ? [] : undefined;
            let tags = yield this.stmt_groupGetByName({ names, groupId: groupId });
            return !isArray ? tags[0] : tags;
        });
    }
    updateTag(repository, state, fieldName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fieldName)
                throw error_1.tagError.selfRename();
            let groupId = state.dto[fieldName];
            let { prev, curr } = this.changes(repository, state);
            yield this.addTag(curr.filter(x => !prev.includes(x)), groupId);
            yield this.deleteTag(prev.filter(x => !curr.includes(x)), groupId);
        });
    }
    doRename(oldName, newName, groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!groupId)
                throw error_1.tagError.groupId();
            let nN = `$.${newName}`;
            let oN = `$.${oldName}`;
            let eN = `"${newName}"`;
            let eO = `"${oldName}"`;
            let oldN = `,${oldName},`;
            let newN = `,${newName},`;
            for (let usage of this.usages) {
                let set = {};
                if (usage.mode && usage.mode === "JSON") {
                    let w = (0, drizzle_orm_1.and)((0, drizzle_orm_1.sql) `json_extract(${usage.repo.schema[usage.field]}, ${oN}) > 0`, (0, drizzle_orm_1.sql) `json_extract(${usage.repo.schema[usage.field]}, ${nN}) is NULL`, (0, drizzle_orm_1.eq)(usage.repo.schema[this.fieldName], groupId));
                    set[usage.field] = (0, drizzle_orm_1.sql) `replace(${usage.repo.schema[usage.field]}, ${eO}, ${eN})`;
                    yield usage.repo.db.update(usage.repo.schema).set(set).where(w);
                    w = (0, drizzle_orm_1.and)((0, drizzle_orm_1.sql) `json_extract(${usage.repo.schema[usage.field]}, ${oN}) > 0`, (0, drizzle_orm_1.sql) `json_extract(${usage.repo.schema[usage.field]}, ${nN}) > 0`);
                    // set[usage.field] = sql`json_remove(json_replace(${usage.repo.schema[usage.field]}, ${nN}, json_value(${usage.repo.schema[usage.field]}, ${nN}) + json_value(${usage.repo.schema[usage.field]}, ${oN})), ${oN})`;
                    set[usage.field] = (0, drizzle_orm_1.sql) `json_remove(${usage.repo.schema[usage.field]}, ${oN})`; // replace this line with the one above, to add the values together
                    yield usage.repo.db.update(usage.repo.schema).set(set).where(w);
                }
                else {
                    set[usage.field] = (0, drizzle_orm_1.sql) `trim(both ',' from replace(concat(',', ${usage.repo.schema[usage.field]} , ','), ${oldN}, ${newN}))`;
                    yield usage.repo.db.update(usage.repo.schema).set(set).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.sql) `FIND_IN_SET(${oldName}, ${usage.repo.schema[usage.field]})`, (0, drizzle_orm_1.not)((0, drizzle_orm_1.sql) `FIND_IN_SET(${newName}, ${usage.repo.schema[usage.field]})`), (0, drizzle_orm_1.eq)(usage.repo.schema[this.fieldName], groupId)));
                    set[usage.field] = (0, drizzle_orm_1.sql) `trim(both ',' from replace(concat(',', ${usage.repo.schema[usage.field]} , ','), ${oldN}, ','))`;
                    yield usage.repo.db.update(usage.repo.schema).set(set).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.sql) `FIND_IN_SET(${oldName}, ${usage.repo.schema[usage.field]})`, (0, drizzle_orm_1.sql) `FIND_IN_SET(${newName}, ${usage.repo.schema[usage.field]})`, (0, drizzle_orm_1.eq)(usage.repo.schema[this.fieldName], groupId)));
                }
            }
        });
    }
    selfRename(state, fieldName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fieldName)
                throw error_1.tagError.selfRename();
            let values = state.dto;
            let originalItem = state.prevDto;
            let groupId = values[fieldName];
            if (!groupId)
                throw error_1.tagError.groupId();
            if (values.name && values.name !== originalItem.name) {
                yield this.doRename(originalItem.name, values.name, groupId);
            }
        });
    }
    addTag(names, groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            let items = yield this.getByName(names, groupId).then(r => (r).map(i => i.name));
            let toAdd = names.filter(x => !items.includes(x));
            for (let tag of toAdd) {
                let item = yield this.create();
                item.name = tag;
                yield this.insert(item);
            }
        });
    }
    deleteTag(names, groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            let items = yield this.getByName(names, groupId);
            if (items.length === 0)
                return;
            yield this.deleteItems(items, groupId);
        });
    }
    deleteItems(items, groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!groupId)
                throw error_1.tagError.groupId();
            for (let item of items) {
                let doDelete = true;
                for (let usage of this.usages) {
                    let res = yield usage.repo.db.select().from(usage.repo.schema).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.sql) `FIND_IN_SET(${item.name}, ${usage.repo.schema[usage.field]})`, (0, drizzle_orm_1.eq)(usage.repo.schema[this.fieldName], groupId))).limit(1).execute();
                    if (res.length !== 0) {
                        doDelete = false;
                        break;
                    }
                }
                if (doDelete) {
                    yield this.delete(item.id);
                    yield this.deleteInUsages(item.name, groupId);
                }
            }
        });
    }
    deleteInUsages(name, groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!groupId)
                throw error_1.tagError.groupId();
            name = `${name}`;
            for (let usage of this.usages) {
                let set = {};
                set[usage.field] = (0, drizzle_orm_1.sql) `trim(both ',' from replace(concat(',', ${usage.repo.schema[usage.field]} , ','), ',${name},', ','))`;
                usage.repo.db.update(usage.repo.schema).set(set).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.sql) `FIND_IN_SET("${name}", ${usage.repo.schema[usage.field]})`, (0, drizzle_orm_1.eq)(usage.repo.schema[this.fieldName], groupId)));
            }
        });
    }
    rename(oldName, newName, groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO call from sapphire
            oldName = oldName.replace(',', "").trim();
            newName = newName.replace(',', "").trim();
            if (oldName === newName)
                return;
            let o = yield this.getByName(oldName, groupId);
            if (!o)
                return;
            let n = yield this.getByName(newName, groupId);
            let item = Array.isArray(o) ? o[0] : o;
            if (!n) {
                item.name = newName;
                yield this.update(item);
            }
            else
                yield this.delete(item);
            yield this.doRename(oldName, newName, groupId);
        });
    }
}
exports.GroupTagRepository = GroupTagRepository;
__decorate([
    awqrd_util_1.MaterializeIt
], GroupTagRepository.prototype, "stmt_groupGetByName", null);
