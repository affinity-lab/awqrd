"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterializeIfDefined = exports.MaterializeIt = void 0;
/**
 * A decorator function that materializes a getter property into a value property after the first access.
 * @param target - The target object.
 * @param name - The name of the property.
 * @param descriptor - The property descriptor.
 */
function MaterializeIt(target, name, descriptor) {
    // Check if a getter exists in the property descriptor
    const getter = descriptor.get;
    if (!getter) {
        throw new Error(`Getter property descriptor expected when materializing at ${target.name}::${name.toString()}`);
    }
    // Override the getter to materialize the property
    descriptor.get = function () {
        const value = getter.call(this);
        Object.defineProperty(this, name, {
            configurable: descriptor.configurable,
            enumerable: descriptor.enumerable,
            writable: false,
            value
        });
        return value;
    };
}
exports.MaterializeIt = MaterializeIt;
/**
 * Materializes the property if it is defined.
 *
 * @param target - The target object.
 * @param name - The name of the property.
 * @param descriptor - The property descriptor.
 */
function MaterializeIfDefined(target, name, descriptor) {
    // Get the getter function from the property descriptor
    const getter = descriptor.get;
    // Throw an error if the getter is not defined
    if (!getter) {
        throw new Error(`Getter property descriptor expected when materializing at ${target.name}::${name.toString()}`);
    }
    // Override the getter function to materialize the property if it is defined
    descriptor.get = function () {
        // Call the original getter function
        const value = getter.call(this);
        // If the value is defined, materialize the property
        if (value !== undefined) {
            Object.defineProperty(this, name, {
                configurable: descriptor.configurable,
                enumerable: descriptor.enumerable,
                writable: false,
                value
            });
        }
        return value;
    };
}
exports.MaterializeIfDefined = MaterializeIfDefined;
