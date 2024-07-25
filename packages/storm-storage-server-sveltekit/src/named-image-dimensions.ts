export type NamedImageDimensions = Record<string,
	Record<string,
		Record<string,
			{ width: number, height: number } | { width: number, height?: number } | { width?: number, height: number }
		>
	>
>

export type KeysOfNamedImg<T> = {
	[K in keyof T]: {
		[P in keyof T[K]]: {
			[Q in keyof T[K][P]]: string;
		};
	};
};

export function keysOfNamedImageDimensions<T extends NamedImageDimensions>(obj: T): KeysOfNamedImg<T> {
	let result: Partial<KeysOfNamedImg<T>> = {};
	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			let r: Partial<{ [P in keyof T[Extract<keyof T, string>]]: { [Q in keyof T[Extract<keyof T, string>][Extract<keyof T[Extract<keyof T, string>], string>]]: string; } }> = {};
			for (const subKey in obj[key]) {
				if (obj[key].hasOwnProperty(subKey)) {
					let s: Partial<{ [Q in keyof T[Extract<keyof T, string>][Extract<keyof T[Extract<keyof T, string>], string>]]: string; }> = {};
					for (const subSubKey in obj[key][subKey]) {
						if (obj[key][subKey].hasOwnProperty(subSubKey)) {
							s[subSubKey] = subSubKey;
						}
					}
					r[subKey] = s as { [Q in keyof T[Extract<keyof T, string>][Extract<keyof T[Extract<keyof T, string>], string>]]: string; };
				}
			}
			result[key] = r as { [P in keyof T[Extract<keyof T, string>]]: { [Q in keyof T[Extract<keyof T, string>][P]]: string; }; };
		}
	}
	return result as KeysOfNamedImg<T>;
}