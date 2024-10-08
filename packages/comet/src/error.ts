import {createErrorData, preprocessErrorTree} from "@affinity-lab/util";


export const cometError = {
	client: {
		unsupported: ()=> createErrorData("The client is no longer supported", {}, 505),
		noInfo: () => createErrorData("Client information not provided."),
		notFound: (name: string, version: number) => createErrorData(`Client not found ${name}(${version})`),
		notAllowed: (name: string, version: number) => createErrorData(`Client not authorized - client: ${name} (version:${version})`, undefined, 405),
	},
	contentTypeNotAccepted: (contentType: string) => createErrorData(`ContentType ${contentType} not accepted`),
	validation: (issues: Record<string, any>) => createErrorData("Validation extended-error", issues, 422),
	unauthorized: () => createErrorData("Unauthorized", {}, 401),
	forbidden: () => createErrorData("Forbidden", {}, 403),
	conflict: (details: Record<string, any> = {}) => createErrorData("Conflict", details, 409),
	notFound: (details: any = {}) => createErrorData("Not Found", details, 404),
	error: (details: Record<string, any> = {}) => createErrorData("Some error occurred", details, 500),
};

preprocessErrorTree(cometError, "COMET");