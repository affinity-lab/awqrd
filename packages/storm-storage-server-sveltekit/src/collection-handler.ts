import {ImageAttachmentMetadata, Rules} from "@affinity-lab/storm-storage";

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
		img: ((width: number, height: number) => ImgUrl & string)
		imgWidth: ((width: number) => ImgUrl & string)
		imgHeight: ((height: number) => ImgUrl & string)
		imgNamed: ((name: string) => ImgUrl & string)

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

	constructor(collection: Collection<METADATA>) {
		this.collection = structuredClone(collection) as FileCollection<METADATA>;

		this.collection.files.forEach(file => {
			let id = collection.id.toString(36).padStart(6, "0");
			file.url = "/file/" + collection.collection + "/" + `${id.slice(0, 2)}/${id.slice(2, 4)}/${id.slice(4, 6)}` + "/" + file.name;
		});
	}

	get files(): Array<FileCollection<METADATA>['files'][number]> { return this.collection.files }
	get id() { return this.collection.id }
	get rules() { return this.collection.rules }
	get collectionName() { return this.collection.collection }
}

export class ImageHandler<METADATA extends ImageAttachmentMetadata = ImageAttachmentMetadata> extends FileHandler<METADATA> {
	declare collection: ImgCollection<METADATA>;

	constructor(collection: Collection<METADATA>) {
		super(collection);
		this.collection.files.forEach(file => {
			let ext = /(?:\.([^.]+))?$/.exec(file.name)?.[1];

			let id = collection.id.toString(36).padStart(6, "0");

			file.img = (width: number, height: number): ImgUrl & string => {
				return new ImgUrl("/img/" + this.collection.collection + "." + id + "-" + width + "x" + height + "@{{d}}." + file.metadata.focus + "-" + file.name + ".{{ext}}?" + file.id, ext) as ImgUrl & string;
			}
			file.imgWidth = (width: number): ImgUrl & string => {
				return new ImgUrl("/img/" + this.collection.collection + "." + id + "-" + width + "x@{{d}}." + file.metadata.focus + "-" + file.name + ".{{ext}}?" + file.id, ext) as ImgUrl & string;
			}
			file.imgHeight = (height: number): ImgUrl & string => {
				return new ImgUrl("/img/" + this.collection.collection + "." + id + "-x" + height + "@{{d}}." + file.metadata.focus + "-" + file.name + ".{{ext}}?" + file.id, ext) as ImgUrl & string;
			}
			file.imgNamed = (name: string): ImgUrl & string => {
				return new ImgUrl("/img/" + this.collection.collection + "." + id + "-:" + name + "@{{d}}." + file.metadata.focus + "-" + file.name + ".{{ext}}?" + file.id, ext) as ImgUrl & string;
			}
		});
	}
	get files(): Array<ImgCollection<METADATA>['files'][number]> { return this.collection.files }
}

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
	get x1() { return this.url.replace("{{d}}", "1").replace("{{ext}}", this.ext) }
	get x2() { return this.url.replace("{{d}}", "2").replace("{{ext}}", this.ext) }
	get x3() { return this.url.replace("{{d}}", "3").replace("{{ext}}", this.ext) }
	get x4() { return this.url.replace("{{d}}", "4").replace("{{ext}}", this.ext) }
	toString() { return this.x1 }
}

