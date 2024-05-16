import type {State} from "@affinity-lab/util";
import {z} from "zod";
import {EntityRepositoryInterface} from "../../entity/entity-repository-interface";

export function validatorPlugin(upsert: z.ZodObject<any>): (repository: EntityRepositoryInterface) => void;
export function validatorPlugin(insert: z.ZodObject<any>, update?: z.ZodObject<any>): (repository: EntityRepositoryInterface) => void;
export function validatorPlugin(insert: z.ZodObject<any>, update?: z.ZodObject<any>) {
	return (repository: EntityRepositoryInterface) => {
		repository.pipelines.insert.blocks.prepare.append(async (state: State<{ dto: Record<string, any> }>) => {insert.parse(state.dto);})
		repository.pipelines.update.blocks.prepare.append(async (state: State<{ dto: Record<string, any> }>) => {(update ?? insert).parse(state.dto);})
	}
}