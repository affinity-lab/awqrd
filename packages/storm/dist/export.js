"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Export = void 0;
const awqrd_util_1 = require("@affinity-lab/awqrd-util");
function Export(target, name) {
    Export.metadata.get(target.constructor, true).push("export", name);
}
exports.Export = Export;
Export.metadata = new awqrd_util_1.ClassMetaData();
