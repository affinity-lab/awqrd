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
exports.resultCacheFactory = void 0;
function resultCacheFactory(cache, mapCache, ...fields) {
    return (res) => __awaiter(this, void 0, void 0, function* () {
        if (Array.isArray(res)) {
            yield cache.set(res.map(dto => { return { key: dto.id, value: dto }; }));
            if (mapCache && fields.length > 0) {
                for (const item of res)
                    for (const field of fields) {
                        mapCache.set({ key: `<${field}>:${item[field]}`, value: item.id });
                    }
            }
        }
        else {
            yield cache.set({ key: res.id, value: res });
            if (mapCache && fields.length > 0) {
                for (const field of fields) {
                    yield mapCache.set({ key: `<${field}>:${res[field]}`, value: res.id });
                }
            }
        }
        return res;
    });
}
exports.resultCacheFactory = resultCacheFactory;
