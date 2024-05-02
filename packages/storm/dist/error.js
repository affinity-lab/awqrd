"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugLog = exports.entityError = void 0;
const awqrd_util_1 = require("@affinity-lab/awqrd-util");
exports.entityError = {
    itemNotFound: (repository, id) => (0, awqrd_util_1.createErrorData)("item not found", { repository, id }, 404),
};
(0, awqrd_util_1.preprocessErrorTree)(exports.entityError, "STORM_ENTITY");
function debugLog(s, lines = true) {
    console.log("--------------------------------------------------------");
    if (typeof s === "string")
        console.log(`***************** ${s} *****************`);
    else
        console.log(s);
    console.log("--------------------------------------------------------");
}
exports.debugLog = debugLog;
