"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagError = void 0;
const awqrd_util_1 = require("@affinity-lab/awqrd-util");
exports.tagError = {
    itemNotFound: (repository) => (0, awqrd_util_1.createErrorData)("item not found!", { repository }, 404),
    groupId: () => (0, awqrd_util_1.createErrorData)("Group id was not provided or the given field name is wrong!", {}, 500),
    selfRename: () => (0, awqrd_util_1.createErrorData)("fieldName wasn't provided for selfRename!", {}, 500),
};
(0, awqrd_util_1.preprocessErrorTree)(exports.tagError, "STORM_TAG");
