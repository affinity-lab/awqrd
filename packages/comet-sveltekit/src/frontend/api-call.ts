export type ApiCallMap = { [key: string]: ((...args: any) => Promise<any>) | ApiCallMap; };

export class ApiError extends Error {
	constructor(status: number, public response: Response) {super(`${status} ${response.statusText}`)}
}

type ApiCallFactoryOptions = {
	errorHandler?: (response: Response) => any,
	createHeaders?: () => Record<string, string>,
	credentials?: RequestCredentials,
	redirect?: RequestRedirect,
	mode?: RequestMode,
}

export function apiCallFactory(
	prefix: string = '/api',
	options: ApiCallFactoryOptions = {}
): (cmd: string, body?: any | FormData, headers?: Record<string, string>) => Promise<any> {

	let errorHandler = options.errorHandler ?? ((response: Response) => {throw new ApiError(response.status, response)});
	let createHeaders = options.createHeaders ?? (() => ({}));
	let fetchOptions = {
		credentials: options.credentials ?? "include",
		redirect: options.redirect ?? "follow",
		mode: options.mode ?? "cors"
	};

	return async function (cmd: string, body?: any | FormData, headers: Record<string, string> = {}) {
		let url = `${prefix}/${cmd}`;
		if (body === undefined) body = null;

		let response = body instanceof FormData
			? await fetch(url, {
				...fetchOptions,
				method: "POST",
				body,
				headers: {...createHeaders(), ...headers}
			})
			: await fetch(url, {
				...fetchOptions,
				method: "POST",
				headers: {...createHeaders(), ...headers, "Content-Type": "application/json"},
				body: JSON.stringify(body)
			})
		;
		return response.ok ? await response.json() : errorHandler!(response);
	}
}