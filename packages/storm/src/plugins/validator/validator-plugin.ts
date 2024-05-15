import type {State} from "@affinity-lab/util";
import {z} from "zod";
import {EntityRepositoryInterface} from "../../entity/entity-repository-interface";

/**
 * A description of the entire function.
 *
 * @param {EntityRepositoryInterface} repository - description of parameter
 * @param {z.ZodObject<any>} upsert - description of parameter
 * @return {void} description of return value
 */
export function validatorPlugin(repository: EntityRepositoryInterface, upsert: z.ZodObject<any>): void;
/**
 * A description of the entire function.
 *
 * @param {EntityRepositoryInterface} repository - description of parameter
 * @param {z.ZodObject<any>} insert - description of parameter
 * @param {z.ZodObject<any>} [update] - description of parameter
 * @return {void} description of return value
 */
export function validatorPlugin(repository: EntityRepositoryInterface, insert: z.ZodObject<any>, update?: z.ZodObject<any>): void;
export function validatorPlugin(repository: EntityRepositoryInterface, insert: z.ZodObject<any>, update?: z.ZodObject<any>): void {
	repository.pipelines.insert.blocks.prepare.append(async (state: State<{ dto: Record<string, any> }>) => {insert.parse(state.dto);})
	repository.pipelines.update.blocks.prepare.append(async (state: State<{ dto: Record<string, any> }>) => {(update ?? insert).parse(state.dto);})
}