"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
const util_1 = require("@affinity-lab/util");
const util_2 = require("@affinity-lab/util");
const export_1 = require("./export");
/**
 * Class representing a storm entity.
 */
class Entity {
    static get exportFields() {
        var _a;
        return (_a = export_1.Export.metadata.read(this.constructor)) === null || _a === void 0 ? void 0 : _a.export;
    }
    $export() {
        const e = {};
        let a = this.constructor.prototype.exportFields;
        if (a)
            for (const key of a)
                e[key] = this[key];
        return e;
    }
    $pick(...fields) {
        let res = this.$export();
        (0, util_2.pickFieldsIP)(res, ...fields);
        return res;
    }
    $omit(...fields) {
        let res = this.$export();
        (0, util_2.omitFieldsIP)(res, ...fields);
        return res;
    }
}
exports.Entity = Entity;
__decorate([
    export_1.Export
], Entity.prototype, "id", void 0);
__decorate([
    util_1.MaterializeIt
], Entity, "exportFields", null);
