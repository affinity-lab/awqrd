"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.methodCacheFactory = void 0;
const crypto_1 = __importDefault(require("crypto"));
/**
 * Factory function to create a method decorator that caches the result of the method
 * @param {Cache} cacheService - The cache service to use for storing and retrieving cached values
 * @returns {MethodDecorator} - The method decorator function
 */
function methodCacheFactory(cacheService) {
    /**
     * Method decorator that caches the result of the decorated method
     * @param {number} ttl - Time-to-live for the cached value in milliseconds
     * @returns {MethodDecorator} - The method decorator
     */
    return function (ttl) {
        /**
         * Actual method decorator function that wraps the original method with caching logic
         * @param {any} target - The target object
         * @param {string} propertyKey - The property key
         * @param {PropertyDescriptor} descriptor - The property descriptor
         * @returns {PropertyDescriptor} - The updated property descriptor with caching logic
         */
        return function (target, propertyKey, descriptor) {
            const innerFunction = target[propertyKey];
            const id = crypto_1.default.randomUUID();
            return Object.assign(Object.assign({}, descriptor), { 
                /**
                 * Cached method that checks if the result is already cached, otherwise calls the original method
                 * @param {any[]} args - Arguments passed to the method
                 * @returns {Promise<any>} - The cached or newly computed result
                 */
                value(...args) {
                    return __awaiter(this, void 0, void 0, function* () {
                        let key = id + crypto_1.default.createHash('md5').update(JSON.stringify(args)).digest("hex");
                        let cached = yield cacheService.get(key);
                        if (cached)
                            return cached;
                        let value = yield innerFunction.apply(this, args);
                        yield cacheService.set({ key, value }, ttl);
                        return value;
                    });
                } });
        };
    };
}
exports.methodCacheFactory = methodCacheFactory;
