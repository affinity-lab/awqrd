"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = void 0;
const crypto = __importStar(require("crypto"));
/**
 * Cache is an abstract class that provides caching functionality.
 *
 * @template T - The type of the cached items.
 */
class Cache {
    constructor(ttl, prefix) {
        this.ttl = ttl;
        this.prefix = prefix;
        if (this.prefix === undefined)
            this.prefix = crypto.randomUUID();
    }
    /**
     * Returns a function that reads a cached item if available; otherwise, retrieves it using the provided handler and caches it.
     * @param ttl - Optional time-to-live value for the cached item.
     * @returns A function that reads and caches items.
     */
    getReader(ttl) {
        const _ttl = ttl === undefined ? this.ttl : ttl;
        return (handler, key, ttl = _ttl) => {
            return this.read(handler, key, ttl);
        };
    }
    /**
     * Returns a function that deletes an item from the cache by key.
     * @returns A function that deletes items from the cache.
     */
    getInvalidator() {
        return (key) => this.del(key);
    }
    /**
     * Reads a cached item by key or retrieves it using the provided handler and caches it.
     * @param handler - The function to retrieve the item if not cached.
     * @param key - The key of the item to read or retrieve.
     * @param ttl - Optional time-to-live value for the cached item.
     * @returns A Promise resolving to the retrieved item.
     */
    read(handler, key, ttl) {
        return __awaiter(this, void 0, void 0, function* () {
            ttl = ttl === undefined ? this.ttl : ttl;
            const cached = yield this.get(key);
            if (cached !== undefined)
                return cached;
            const value = yield handler();
            yield this.set({ key, value }, ttl);
            return value;
        });
    }
    key(key) {
        return Array.isArray(key) ? key.map(k => this.prefix + "." + k.toString()) : this.prefix + "." + key.toString();
    }
}
exports.Cache = Cache;
