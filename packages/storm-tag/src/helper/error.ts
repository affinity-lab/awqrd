import {createErrorData, preprocessErrorTree} from "@affinity-lab/util";

export const tagError = {
	itemNotFound: (repository: string) => createErrorData("item not found!", {repository}, 404),
	groupId: (details: any = {}) => createErrorData("Group id was not provided or the given field name is wrong!", details, 500),
	selfRename: () => createErrorData("fieldName wasn't provided for selfRename!", {}, 500),
	groupPrepare: () => createErrorData("Group tag's prepare is not needed", {}, 500)
};

preprocessErrorTree(tagError, "STORM_TAG");