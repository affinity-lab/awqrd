import {ExtendedError} from "@affinity-lab/util";
import {CometResult} from "../comet-result";

export async function extendedErrorHandler(error: any) {
	return error instanceof ExtendedError ? new CometResult(error, error.httpResponseCode) : null
}