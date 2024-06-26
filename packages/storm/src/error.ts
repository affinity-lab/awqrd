import {createErrorData, preprocessErrorTree} from "@affinity-lab/util";


export const entityError = {
	itemNotFound: (repository: string, id: number | undefined | null) =>
		createErrorData("item not found", {repository, id}, 404),
	itemNotExists: () => createErrorData("Entity doesn't exist yet!", undefined, 404),
	duplicateEntry: (args: any) => createErrorData("Duplicate Entry", {originalError: args}, 409)
};

preprocessErrorTree(entityError, "STORM_ENTITY");
