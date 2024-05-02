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
exports.TagRepository = exports.TagEntity = void 0;
const entity_repository_1 = require("../../entity-repository");
const entity_1 = require("../../entity");
const awqrd_util_1 = require("@affinity-lab/awqrd-util");
const helper_1 = require("../../helper");
const drizzle_orm_1 = require("drizzle-orm");
const error_1 = require("./helper/error");
const export_1 = require("../../export");
class TagEntity extends entity_1.Entity {
    constructor() {
        super(...arguments);
        this.name = null;
    }
}
exports.TagEntity = TagEntity;
__decorate([
    export_1.Export
], TagEntity.prototype, "name", void 0);
class TagRepository extends entity_repository_1.EntityRepository {
    constructor() {
        super(...arguments);
        this.usages = [];
    }
    addUsage(usage) {
        this.usages.push(...(Array.isArray(usage) ? usage : [usage]));
    }
    get stmt_getByName() {
        return (0, helper_1.stmt)(this.db.select().from(this.schema).where((0, drizzle_orm_1.sql) `name IN (${drizzle_orm_1.sql.placeholder("names")})`));
    }
    getByName(names) {
        return __awaiter(this, void 0, void 0, function* () {
            let isArray = Array.isArray(names);
            if (typeof names === "string")
                names = [names];
            if (names.length === 0)
                return isArray ? [] : undefined;
            let tags = yield this.stmt_getByName({ names });
            return !isArray ? tags[0] : tags;
        });
    }
    prepare(repository, state) {
        let values = state.dto;
        for (let usage of this.usages) {
            if (usage.repo === repository) {
                if (!values[usage.field])
                    values[usage.field] = "";
                values[usage.field] = [...new Set(values[usage.field].trim().split(',').map(x => x.trim()).filter(x => !!x))].join(',');
            }
        }
    }
    changes(repository, state) {
        let values = state.dto;
        let originalItem = state.prevDto;
        if (!originalItem)
            throw error_1.tagError.itemNotFound(repository.constructor.name);
        let prev = [];
        let curr = [];
        for (let usage of this.usages) {
            if (usage.repo === repository) {
                prev.push(...(originalItem[usage.field] ? originalItem[usage.field].split(',') : []));
                curr.push(...(values[usage.field] ? values[usage.field].split(',') : []));
            }
        }
        prev = [...new Set(prev)];
        curr = [...new Set(curr)];
        return { prev, curr };
    }
    updateTag(repository, state) {
        return __awaiter(this, void 0, void 0, function* () {
            let { prev, curr } = this.changes(repository, state);
            yield this.addTag(curr.filter(x => !prev.includes(x)));
            yield this.deleteTag(prev.filter(x => !curr.includes(x)));
        });
    }
    addTag(names) {
        return __awaiter(this, void 0, void 0, function* () {
            let items = yield this.getByName(names).then(r => (r).map(i => i.name));
            let toAdd = names.filter(x => !items.includes(x));
            for (let tag of toAdd) {
                let item = yield this.create();
                item.name = tag;
                yield this.insert(item);
            }
        });
    }
    // DELETE ----------------------------------------
    deleteTag(names) {
        return __awaiter(this, void 0, void 0, function* () {
            let items = yield this.getByName(names);
            if (items.length === 0)
                return;
            yield this.deleteItems(items);
        });
    }
    deleteItems(items) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let item of items) {
                let doDelete = true;
                for (let usage of this.usages) {
                    let res = yield usage.repo.db.select().from(usage.repo.schema).where((0, drizzle_orm_1.sql) `FIND_IN_SET(${item.name}, ${usage.repo.schema[usage.field]})`).limit(1).execute();
                    if (res.length !== 0) {
                        doDelete = false;
                        break;
                    }
                }
                if (doDelete) {
                    yield this.delete(item.id);
                    yield this.deleteInUsages(item.name);
                }
            }
        });
    }
    deleteInUsages(name) {
        return __awaiter(this, void 0, void 0, function* () {
            name = `${name}`;
            for (let usage of this.usages) {
                let set = {};
                set[usage.field] = (0, drizzle_orm_1.sql) `trim(both ',' from replace(concat(',', ${usage.repo.schema[usage.field]} , ','), ',${name},', ','))`;
                usage.repo.db.update(usage.repo.schema).set(set).where((0, drizzle_orm_1.sql) `FIND_IN_SET("${name}", ${usage.repo.schema[usage.field]})`);
            }
        });
    }
    // ------------------------------------------
    doRename(oldName, newName) {
        for (let usage of this.usages) {
            let set = {};
            set[usage.field] = (0, drizzle_orm_1.sql) `trim(both ',' from replace(concat(',', ${usage.field} , ','), ',${oldName},', ',${newName},'))`;
            usage.repo.db.update(usage.repo.schema).set(set).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.sql) `FIND_IN_SET("${oldName}", ${usage.field})`, (0, drizzle_orm_1.not)((0, drizzle_orm_1.sql) `FIND_IN_SET("${newName}", ${usage.field})`)));
            set[usage.field] = (0, drizzle_orm_1.sql) `trim(both ',' from replace(concat(',', ${usage.field} , ','), ',${oldName},', ','))`;
            usage.repo.db.update(usage.repo.schema).set(set).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.sql) `FIND_IN_SET("${oldName}", ${usage.field})`, (0, drizzle_orm_1.sql) `FIND_IN_SET("${newName}", ${usage.field})`));
        }
    }
    selfRename(state) {
        return __awaiter(this, void 0, void 0, function* () {
            let values = state.dto;
            let originalItem = state.prevDto;
            if (values.name && values.name !== originalItem.name) {
                yield this.doRename(originalItem.name, values.name);
            }
        });
    }
    rename(oldName, newName) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO call from sapphire
            oldName = oldName.replace(',', "").trim();
            newName = newName.replace(',', "").trim();
            if (oldName === newName)
                return;
            let o = yield this.getByName(oldName);
            if (!o)
                return;
            let n = yield this.getByName(newName);
            let item = Array.isArray(o) ? o[0] : o;
            if (!n) {
                item.name = newName;
                yield this.update(item);
            }
            else
                yield this.delete(item);
            yield this.doRename(oldName, newName);
        });
    }
}
exports.TagRepository = TagRepository;
__decorate([
    awqrd_util_1.MaterializeIt
], TagRepository.prototype, "stmt_getByName", null);
