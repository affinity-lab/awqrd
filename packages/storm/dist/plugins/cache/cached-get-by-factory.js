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
exports.cachedGetByFactory = void 0;
const helper_1 = require("../../helper");
function cachedGetByFactory(repo, fieldName, resultCache, mapCache) {
    let getBy = (0, helper_1.getByFactory)(repo, fieldName);
    return (search) => __awaiter(this, void 0, void 0, function* () {
        let key = `<${fieldName}>:${search}`;
        let id = yield mapCache.get(key);
        if (id) {
            let state = yield repo.pipelines.getOne.run(repo, { id });
            if (state.dto[fieldName] === search)
                return state.item;
            yield mapCache.del(key);
        }
        let res = yield getBy.stmt.execute({ search });
        yield resultCache(res);
        let item = yield repo.instantiators.first(res);
        if (item)
            yield mapCache.set({ key, value: item.id });
        return item;
    });
}
exports.cachedGetByFactory = cachedGetByFactory;
