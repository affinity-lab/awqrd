"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cometError = void 0;
const awqrd_util_1 = require("@affinity-lab/awqrd-util");
exports.cometError = {
    client: {
        noInfo: () => (0, awqrd_util_1.createErrorData)("Client information not provided."),
        notFound: (name, version) => (0, awqrd_util_1.createErrorData)(`Client not found ${name}(${version})`),
        notAuthorized: (name, version) => (0, awqrd_util_1.createErrorData)(`Client not authorized ${name}(${version})`),
    },
    contentTypeNotAccepted: (contentType) => (0, awqrd_util_1.createErrorData)(`ContentType ${contentType} not accepted`),
    validation: (issues) => (0, awqrd_util_1.createErrorData)("Validation extended-error", issues, 400),
    unauthorized: () => (0, awqrd_util_1.createErrorData)("Unauthorized", {}, 401),
    forbidden: () => (0, awqrd_util_1.createErrorData)("Forbidden", {}, 403),
    conflict: (details = {}) => (0, awqrd_util_1.createErrorData)("Conflict", details, 409),
    notFound: (details = {}) => (0, awqrd_util_1.createErrorData)("Not Found", details, 404),
    error: (details = {}) => (0, awqrd_util_1.createErrorData)("Some error occurred", details, 500),
};
(0, awqrd_util_1.preprocessErrorTree)(exports.cometError, "COMET");
