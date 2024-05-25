import {createErrorData, preprocessErrorTree} from "@affinity-lab/util";

export const tagError = {
	itemNotFound: (repository: string) => createErrorData("item not found!", {repository}, 404),
	groupId: () => createErrorData("Group id was not provided or the given field name is wrong!", {}, 500),
	selfRename: () => createErrorData("fieldName wasn't provided for selfRename!", {}, 500),
};

preprocessErrorTree(tagError, "STORM_TAG");