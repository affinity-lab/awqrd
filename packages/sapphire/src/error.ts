import {createErrorData, preprocessErrorTree} from "@affinity-lab/util";


export const sapphireError = {
	notFound: (details: Record<string, any> = {}) => createErrorData("Not Found", details, 404),
};

preprocessErrorTree(sapphireError, "COMET");