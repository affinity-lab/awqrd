import {createErrorData, preprocessErrorTree} from "@affinity-lab/util";


export const sapphireError = {
	notFound: (details: Record<string, any> = {}) => createErrorData("Not Found", details, 404),
	unauthorized: () => createErrorData("Unauthorized", {}, 401),
	forbidden: () => createErrorData("Forbidden", {}, 403),
	collectionNotExist: (name: string) => createErrorData("Collection does not exist!", {name}, 404),
	fileNotProvided: () => createErrorData("File is not provided", undefined, 400)
};

preprocessErrorTree(sapphireError, "COMET");