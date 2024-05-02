"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageError = void 0;
const awqrd_util_1 = require("@affinity-lab/awqrd-util/");
exports.storageError = {
    ownerNotExists: (name, id) => (0, awqrd_util_1.createErrorData)("file can not be added to non existing owner", { name, id }, 500),
    fileTooLarge: (name, id, filename, sizeLimit) => (0, awqrd_util_1.createErrorData)("file size is too large", { name, id, filename, sizeLimit }, 500),
    extensionNotAllowed: (name, id, filename, allowedExtensions) => (0, awqrd_util_1.createErrorData)("file extension is not allowed", { name, id, filename, allowedExtensions }, 500),
    tooManyFiles: (name, id, filename, limit) => (0, awqrd_util_1.createErrorData)("no more storage allowed", { name, id, filename, limit }, 500),
    attachedFileNotFound: (name, id, filename) => (0, awqrd_util_1.createErrorData)("attached file not found", { name, id, filename }, 500)
};
(0, awqrd_util_1.preprocessErrorTree)(exports.storageError, "STORM_STORAGE");
