"use strict";
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
exports.cachePlugin = void 0;
const result_cache_factory_1 = require("./result-cache-factory");
function cachePlugin(repository, cache, resultCache) {
    if (resultCache === undefined)
        resultCache = (0, result_cache_factory_1.resultCacheFactory)(cache);
    repository.pipelines.getOne.blocks
        .prepare.append((state) => __awaiter(this, void 0, void 0, function* () {
        state.dto = yield cache.get(state.id);
    }))
        .finalize.prepend((state) => __awaiter(this, void 0, void 0, function* () {
        if (state.dto !== undefined) {
            yield resultCache(state.dto);
            //await cache.set({key: state.id, value: state.dto})
        }
    }));
    repository.pipelines.getAll.blocks
        .prepare.append((state) => __awaiter(this, void 0, void 0, function* () {
        state.dtos = yield cache.get(state.ids);
        let dtoIds = state.dtos.map(dto => dto.id);
        state.ids = state.ids.filter(num => !dtoIds.includes(num));
    }))
        .finalize.prepend((state) => __awaiter(this, void 0, void 0, function* () {
        yield resultCache(state.dtos);
        // await cache.set(state.dtos.map(dto => {return {key: dto.id, value: dto} }))
    }));
    repository.pipelines.update.blocks
        .finalize.append((state) => __awaiter(this, void 0, void 0, function* () { yield cache.del(state.item.id); }));
    repository.pipelines.delete.blocks
        .finalize.append((state) => __awaiter(this, void 0, void 0, function* () { yield cache.del(state.item.id); }));
    repository.pipelines.overwrite.blocks
        .finalize.append((state) => __awaiter(this, void 0, void 0, function* () { yield cache.del(state.item.id); }));
}
exports.cachePlugin = cachePlugin;
