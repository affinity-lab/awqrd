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
exports.tagPlugin = void 0;
function tagPlugin(repository, tagRepository, field, groupField) {
    let usage = { repo: repository, field };
    if (groupField)
        usage[tagRepository.fieldName] = repository[groupField]; // TODO CHECK IF THIS WORKS AND IF YES TRY TO TYPEHINT IT
    tagRepository.addUsage(usage);
    repository.pipelines.update.blocks
        .prepare.append((state) => __awaiter(this, void 0, void 0, function* () {
        state.prevDto = yield repository.getRaw(state.item.id);
        tagRepository.prepare(repository, state);
    }))
        .finalize.append((state) => __awaiter(this, void 0, void 0, function* () {
        yield tagRepository.selfRename(state, groupField);
        yield tagRepository.updateTag(repository, state, groupField);
    }));
    repository.pipelines.delete.blocks
        .finalize.append((state) => __awaiter(this, void 0, void 0, function* () {
        yield tagRepository.updateTag(repository, state, groupField);
    }));
    repository.pipelines.insert.blocks
        .prepare.append((state) => __awaiter(this, void 0, void 0, function* () {
        state.prevDto = yield repository.getRaw(state.item.id);
        tagRepository.prepare(repository, state);
    }));
    repository.pipelines.overwrite.blocks
        .finalize.append((state) => __awaiter(this, void 0, void 0, function* () {
        yield tagRepository.selfRename(state, groupField);
        yield tagRepository.updateTag(repository, state, groupField);
    }));
}
exports.tagPlugin = tagPlugin;
