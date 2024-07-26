export type ImgFocus = "centre" | "top" | "left" | "bottom" | "right" | "entropy" | "attention"

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
			size: ((width: number, height: number) => ImgUrl & string)
			width: ((width: number) => ImgUrl & string)
			height: ((height: number) => ImgUrl & string)
			named: ((name: string) => ImgUrl & string)
		}
	}>;
};

export class FileHandler<METADATA extends Record<string, any> = Record<string, any>> {

	static create<MD extends Record<string, any> = Record<string, any>, T extends typeof FileHandler<MD> = typeof FileHandler<MD>>(this: T, collection: Collection<MD>): InstanceType<T>
	static create<MD extends Record<string, any> = Record<string, any>, T extends typeof FileHandler<MD> = typeof FileHandler<MD>>(this: T, collection: undefined): undefined
	static create<
		MD extends Record<string, any> = Record<string, any>,
		T extends typeof FileHandler<MD> = typeof FileHandler<MD>
	>(this: T, collection: Collection<MD> | undefined): InstanceType<T> | undefined {
		if (collection === undefined) return undefined;
		return new this(collection!) as InstanceType<T>;
	}

	public collection: FileCollection<METADATA>;

	static fileUrlPrefix = "/file";
	protected fileUrlPrefix: string;


	constructor(collection: Collection<METADATA>) {
		this.fileUrlPrefix = (this.constructor as typeof FileHandler).fileUrlPrefix;

		this.collection = structuredClone(collection) as FileCollection<METADATA>;

		this.collection.files.forEach(file => {
			let id = collection.id.toString(36).padStart(6, "0");
			file.url = this.fileUrlPrefix + "/" + collection.collection + "/" + `${id.slice(0, 2)}/${id.slice(2, 4)}/${id.slice(4, 6)}` + "/" + file.name;
		});
	}

	get files(): Array<FileCollection<METADATA>['files'][number]> { return this.collection.files }
	get id() { return this.collection.id }
	get rules() { return this.collection.rules }
	get collectionName() { return this.collection.collection }
}

export class ImageHandler<METADATA extends ImageAttachmentMetadata = ImageAttachmentMetadata> extends FileHandler<METADATA> {
	declare collection: ImgCollection<METADATA>;

	protected static imgUrlPrefix = "/img";
	protected imgUrlPrefix: string;

	constructor(collection: Collection<METADATA>) {
		super(collection);
		this.imgUrlPrefix = (this.constructor as typeof ImageHandler).imgUrlPrefix;

		this.collection.files.forEach(file => {
			let ext = /(?:\.([^.]+))?$/.exec(file.name)?.[1];
			let id = collection.id.toString(36).padStart(6, "0");

			file.img = {
				size: (width: number, height: number): ImgUrl & string => new ImgUrl(this.imgUrlPrefix + "/" + this.collection.collection + "." + id + "-" + width + "x" + height + "@{{d}}." + file.metadata.focus + "-" + file.name + ".{{ext}}?" + file.id, ext) as ImgUrl & string,
				width: (width: number): ImgUrl & string => new ImgUrl(this.imgUrlPrefix + "/" + this.collection.collection + "." + id + "-" + width + "x@{{d}}." + file.metadata.focus + "-" + file.name + ".{{ext}}?" + file.id, ext) as ImgUrl & string,
				height: (height: number): ImgUrl & string => new ImgUrl(this.imgUrlPrefix + "/" + this.collection.collection + "." + id + "-x" + height + "@{{d}}." + file.metadata.focus + "-" + file.name + ".{{ext}}?" + file.id, ext) as ImgUrl & string,
				named: (name: string): ImgUrl & string => new ImgUrl(this.imgUrlPrefix + "/" + this.collection.collection + "." + id + "-:" + name + "@{{d}}." + file.metadata.focus + "-" + file.name + ".{{ext}}?" + file.id, ext) as ImgUrl & string,
			}
		});
	}
	get files(): Array<ImgCollection<METADATA>['files'][number]> { return this.collection.files }
}

type ResolutionOptions = 1 | 2 | 3 | 4;

export class ImgUrl {
	private ext = "webp";
	constructor(private url: string, private originalExtension?: string) {
	}
	as(ext?: "webp" | "gif" | "jpg" | "png") {
		if (typeof ext === "undefined") {
			if (typeof this.originalExtension !== "undefined") this.ext = this.originalExtension;
		} else this.ext = ext;
		return this;
	}

	srcset(resolution: ResolutionOptions = 3): string {
		let output: Array<string> = []
		for (let i = 1; i < resolution + 1; i++) output.push(this.x(i as ResolutionOptions) + ` ${i}x`)
		return output.join(" ");
	}

	protected x(resolution: ResolutionOptions): string {
		return this.url.replace("{{d}}", resolution.toString()).replace("{{ext}}", this.ext)
	}

	get x1() { return this.x(1) }
	get x2() { return this.x(2) }
	get x3() { return this.x(3) }
	get x4() { return this.x(4) }

	toString() { return this.x1 }
}

