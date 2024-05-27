import { EntityRepositoryInterface } from "@affinity-lab/storm";
import { type ResultCache } from "./result-cache-factory";
export declare function cachePlugin(resultCache: ResultCache): (repository: EntityRepositoryInterface) => void;
