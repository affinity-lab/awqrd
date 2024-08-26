export class CometResult {
	#headers: Array<[string, string]> = [];
	get headers(): Readonly<Array<[string, string]>> {
		return this.#headers;
	}
	constructor(public result: any, public status: number = 200) {}

	setStatus(status: number): CometResult {
		this.status = status;
		return this;
	}
	addHeader(name: string, value: string): CometResult {
		this.#headers.push([name, value]);
		return this;
	}
	ok(): CometResult {
		this.setStatus(200);
		return this;
	}
	badRequest(): CometResult {
		this.setStatus(400);
		return this;
	}
	unauthorized(): CometResult {
		this.setStatus(401);
		return this;
	}
	forbidden(): CometResult {
		this.setStatus(403);
		return this;
	}
	notFound(): CometResult {
		this.setStatus(404);
		return this;
	}
	conflict(): CometResult {
		this.setStatus(409);
		return this;
	}
	unprocessableEntity(): CometResult {
		this.setStatus(422);
		return this;
	}
	internalServerError(): CometResult {
		this.setStatus(500);
		return this;
	}

	noCache(): CometResult {
		this.addHeader("Cache-Control", "no-cache, no-store, must-revalidate");
		return this;
	}
	cache(time: number = 31536000): CometResult {
		this.addHeader("Cache-Control", "public, max-age=31536000");
		return this;
	}

	contentType(type: string): CometResult {
		this.addHeader("Content-Type", type);
		return this;
	}
	setCookie(name: string, value: string, options: {
		expires?: Date,
		maxAge?: number,
		domain?: string,
		path?: string,
		secure?: boolean,
		httpOnly?: boolean,
		sameSite?: "Strict" | "Lax" | "None"
	} = {}): CometResult {
		const defaultOptions = {maxAge: 0, secure: true, httpOnly: true}
		options = !options ? defaultOptions : {...defaultOptions, ...options};
		let cookie = `${name}=${value}`;
		if (options.expires !== undefined) cookie += `; Expires=${options.expires.toUTCString()}`;
		if (options.maxAge !== undefined) cookie += `; Max-Age=${options.maxAge}`;
		if (options.domain !== undefined) cookie += `; Domain=${options.domain}`;
		if (options.path !== undefined) cookie += `; Path=${options.path}`;
		if (options.secure !== undefined) cookie += `; Secure`;
		if (options.httpOnly !== undefined) cookie += `; HttpOnly`;
		if (options.sameSite !== undefined) cookie += `; SameSite=${options.sameSite}`;
		this.addHeader("Set-Cookie", cookie);
		return this;
	}
	delCookie(name: string): CometResult {
		this.setCookie(name, "", {maxAge: 0});
		return this;
	}
}