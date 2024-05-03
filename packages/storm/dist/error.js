"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugLog = exports.entityError = void 0;
const util_1 = require("@affinity-lab/util");
exports.entityError = {
    itemNotFound: (repository, id) => (0, util_1.createErrorData)("item not found", { repository, id }, 404),
};
(0, util_1.preprocessErrorTree)(exports.entityError, "STORM_ENTITY");
function debugLog(s, lines = true) {
    console.log("--------------------------------------------------------");
    if (typeof s === "string")
        console.log(`***************** ${s} *****************`);
    else
        console.log(s);
    console.log("--------------------------------------------------------");
}
exports.debugLog = debugLog;
