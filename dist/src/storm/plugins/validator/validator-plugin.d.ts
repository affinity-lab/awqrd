import { z } from "zod";
import { EntityRepository } from "../../entity-repository.ts";
/**
 * A description of the entire function.
 *
 * @param {EntityRepository<any, any, any>} repository - description of parameter
 * @param {z.ZodObject<any>} upsert - description of parameter
 * @return {void} description of return value
 */
export declare function validatorPlugin(repository: EntityRepository<any, any, any>, upsert: z.ZodObject<any>): void;
/**
 * A description of the entire function.
 *
 * @param {EntityRepository<any, any, any>} repository - description of parameter
 * @param {z.ZodObject<any>} insert - description of parameter
 * @param {z.ZodObject<any>} [update] - description of parameter
 * @return {void} description of return value
 */
export declare function validatorPlugin(repository: EntityRepository<any, any, any>, insert: z.ZodObject<any>, update?: z.ZodObject<any>): void;
