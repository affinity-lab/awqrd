type GetPropertyDescriptor<T, R> = PropertyDescriptor & {
    get?: (this: T) => R;
};
/**
 * A decorator function that materializes a getter property into a value property after the first access.
 * @param target - The target object.
 * @param name - The name of the property.
 * @param descriptor - The property descriptor.
 */
export declare function MaterializeIt<T, R>(target: any, name: PropertyKey, descriptor: GetPropertyDescriptor<T, R>): void;
/**
 * Materializes the property if it is defined.
 *
 * @param target - The target object.
 * @param name - The name of the property.
 * @param descriptor - The property descriptor.
 */
export declare function MaterializeIfDefined<T, R>(target: any, name: PropertyKey, descriptor: PropertyDescriptor): void;
export {};
