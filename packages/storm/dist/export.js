"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Export = void 0;
const util_1 = require("@affinity-lab/util");
function Export(target, name) {
    Export.metadata.get(target.constructor, true).push("export", name);
}
exports.Export = Export;
Export.metadata = new util_1.ClassMetaData();
