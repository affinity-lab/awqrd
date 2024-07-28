export type ImgFocus = "centre" | "top" | "left" | "bottom" | "right" | "entropy" | "attention";

export type Rules = {
	limit: {
		size: number
		count: number
	},
	mime: undefined | Array<string>
	ext: undefined | Array<string>
}
export type ImgRGB = {
	r: number
	g: number
	b: number
}
export type ImageAttachmentMetadata = {
	title?: string
	focus: ImgFocus
	readonly width?: number
	readonly height?: number
	readonly color?: ImgRGB
	readonly animated: boolean
}
export type Collection<METADATA extends Record<string, any> = Record<string, any>> = {
	collection: string;
	files: Array<{
		id: string
		name: string
		size: number
		metadata: METADATA,
	}>
	id: number
	rules: Rules
}
export type FileCollection<METADATA extends Record<string, any> = Record<string, any>> = Omit<Collection<METADATA>, 'files'> & {
	files: Array<Collection<METADATA>['files'][number] & { url: string }>;
};
export type ImgCollection<METADATA extends Record<string, any> = Record<string, any>> = Omit<FileCollection<METADATA>, 'files'> & {
	files: Array<FileCollection<METADATA>['files'][number] & {
		img: {
			size: ((width: number, height: number) => ImgUrlInterface & string)
			width: ((width: number) => ImgUrlInterface & string)
			height: ((height: number) => ImgUrlInterface & string)
			named: ((name: string) => ImgUrlInterface & string)
		}
	}>;
};
export type ResolutionOptions = 1 | 2 | 3 | 4;
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

export interface ImgUrlInterface {
	readonly x1: string;
	readonly x2: string;
	readonly x3: string;
	readonly x4: string;
	as(ext?: "webp" | "gif" | "jpg" | "png"): this;
	srcset(resolution: ResolutionOptions): string;
	x(resolution: ResolutionOptions): string;
	toString(): any;
}