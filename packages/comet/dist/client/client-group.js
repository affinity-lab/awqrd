"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientGroup = void 0;
class ClientGroup {
    constructor(...clients) {
        this.clients = clients;
    }
    get(version) {
        return this.clients.find((client) => client.version === version);
    }
    all() { return this.clients; }
    range(from = 0, to) {
        const selectedVersions = [];
        for (const client of this.clients) {
            if (client.version >= from && (!to || client.version <= to)) {
                selectedVersions.push(client);
            }
        }
        return selectedVersions;
    }
    pick(...versions) {
        if (versions.length === 0)
            return [];
        const requestedVersions = [];
        for (const version of versions) {
            if (this.clients.some((client) => client.version === version)) {
                requestedVersions.push(this.clients.find((client) => client.version === version));
            }
        }
        return requestedVersions;
    }
    omit(...versions) {
        if (versions.length === 0)
            return this.clients;
        const omittedVersions = [];
        for (const client of this.clients) {
            if (!versions.includes(client.version)) {
                omittedVersions.push(client);
            }
        }
        return omittedVersions;
    }
    filter(predicate) {
        return this.clients.filter(predicate);
    }
    last() {
        return this.clients[this.clients.length - 1];
    }
}
exports.ClientGroup = ClientGroup;
