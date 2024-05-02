"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClient = void 0;
const error_1 = require("../error");
function getClient(clients, name, version, apiKey) {
    if (name === undefined || version === undefined)
        throw error_1.cometError.client.noInfo();
    if (clients[name] === undefined)
        throw error_1.cometError.client.notFound(name, version);
    let client = clients[name].get(version);
    if (client === undefined)
        throw error_1.cometError.client.notFound(name, version);
    if (!client.authApi(apiKey))
        throw error_1.cometError.client.notAuthorized(name, version);
    return client;
}
exports.getClient = getClient;
