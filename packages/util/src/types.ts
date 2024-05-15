export type ConstructorOf<CLASS> = new (...args: any[]) => CLASS;
export type MaybePromise<TYPE> = TYPE | Promise<TYPE>;
export type MaybeArray<TYPE> = TYPE | Array<TYPE>
export type MaybeUndefined<TYPE> = TYPE | undefined;
export type MaybeNull<TYPE> = TYPE | null;
export type MaybeUnset<TYPE> = TYPE | null | undefined;
export type NonEmptyArray<T = any> = [T, ...T[]];
export type EmptyArray = [];
export type NumericString = `${number}`;
export type Numeric = NumericString|number;

/**
 * A constructor type.
 * @template OBJECT_TYPE - The type of the object.
 */
export type T_Constructor<OBJECT_TYPE> = (new (...args: any[]) => OBJECT_TYPE);

/**
 * A class type.
 * @template OBJECT_TYPE - The type of the object.
 * @template CLASS - The type of the class.
 */
export type T_Class<OBJECT_TYPE, CLASS> = T_Constructor<OBJECT_TYPE> & CLASS;