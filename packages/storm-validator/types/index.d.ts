import { EntityRepositoryInterface } from "@affinity-lab/storm";
import { z } from "zod";
export declare function validatorPlugin(upsert: z.ZodObject<any>): (repository: EntityRepositoryInterface) => void;
export declare function validatorPlugin(insert: z.ZodObject<any>, update?: z.ZodObject<any>): (repository: EntityRepositoryInterface) => void;
