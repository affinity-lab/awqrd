"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readCommands = void 0;
const util_1 = require("@affinity-lab/util");
const util_2 = require("@affinity-lab/util");
const comet_1 = require("./comet");
function readCommands(commandsPath, clients) {
    (0, util_1.loadModuleDefaultExports)(commandsPath);
    let allClients = [];
    for (const key in clients)
        allClients.push(...clients[key].all());
    comet_1.Comet.classMetaData.stores.forEach((store) => {
        let config = comet_1.Comet.classMetaData.read(store.target, { flatten: false, simple: true });
        if (config === undefined)
            throw Error("Config not found for " + store.target.name + ". Did you forget to add the @Comet decorator?");
        let group = config["group"];
        let cometInstance = new store.target(); // TODO typehint
        for (const key in config["command"]) {
            let name = ((group["name"] || store.target.name) + "." + (config["command"][key]["name"] || key)).toLowerCase();
            let clients = config["command"][key]["clients"] || group["clients"] || allClients;
            let params = [];
            if (config["params"] !== undefined) {
                for (const param in config["params"][key]) {
                    params[parseInt(param)] = config["params"][key][param];
                }
            }
            clients.forEach((client) => {
                config["command"][key] = (0, util_2.omitFields)(config["command"][key], "name", "clients");
                client.add(name, cometInstance, key, config["command"][key], params);
            });
        }
    });
}
exports.readCommands = readCommands;
