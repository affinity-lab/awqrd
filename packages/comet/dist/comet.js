"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comet = void 0;
const awqrd_util_1 = require("@affinity-lab/awqrd-util");
class Comet {
    static Args(target, propertyKey, index) {
        Comet.classMetaData.get(target.constructor, true).set(["params", propertyKey, index.toString()], "args");
    }
    static Files(target, propertyKey, index) {
        Comet.classMetaData.get(target.constructor, true).set(["params", propertyKey, index.toString()], "files");
    }
    static Env(target, propertyKey, index) {
        Comet.classMetaData.get(target.constructor, true).set(["params", propertyKey, index.toString()], "env");
    }
    static Client(target, propertyKey, index) {
        Comet.classMetaData.get(target.constructor, true).set(["params", propertyKey, index.toString()], "client");
    }
    static Ctx(target, propertyKey, index) {
        Comet.classMetaData.get(target.constructor, true).set(["params", propertyKey, index.toString()], "ctx");
    }
    static Command(config = {}) {
        return (target, propertyKey) => {
            if (config === undefined)
                config = {};
            if (config.name === undefined)
                config.name = propertyKey;
            this.classMetaData.get(target.constructor, true);
            for (const key in config) {
                this.classMetaData.get(target.constructor, true).set(["command", propertyKey, key], config[key]);
            }
        };
    }
    static Group(config = {}) {
        return (target) => {
            if (config === undefined)
                config = {};
            if (config.name === undefined)
                config.name = target.name;
            this.classMetaData.get(target, true);
            for (const key in config) {
                this.classMetaData.get(target, true).set(["group", key], config[key]);
            }
        };
    }
}
exports.Comet = Comet;
Comet.classMetaData = new awqrd_util_1.ClassMetaData();
