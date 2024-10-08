import {ToString} from "@affinity-lab/util";
import {FileCollectionHandler} from "./file-collection-handler";
import {Collection, ImageAttachmentMetadata, ImgCollection, ImgUrlInterface, ResolutionOptions} from "./types";


export class ImageCollectionHandler<METADATA extends ImageAttachmentMetadata = ImageAttachmentMetadata> extends FileCollectionHandler<METADATA> {
	declare collection: ImgCollection<METADATA>;

	static imgUrlPrefix = "/img";
	protected imgUrlPrefix: string;

	constructor(collection: Collection<METADATA>) {
		super(collection);
		this.imgUrlPrefix = (this.constructor as typeof ImageCollectionHandler).imgUrlPrefix;

		this.collection.files.forEach(file => {
			let ext = /(?:\.([^.]+))?$/.exec(file.name)?.[1];
			let id = collection.id.toString(36).padStart(6, "0");
			if (ext && ["png", "webp", "gif", "jpg", "jpeg", "tiff"].includes(ext)) {
				let focus = file.metadata.focus || "entropy"
				file.img = {
					size: (width: number, height: number): ToString<ImgUrl> => new ImgUrl(this.imgUrlPrefix + "/" + this.collection.collection + "." + id + "-" + width + "x" + height + "@{{d}}." + focus + "-" + file.name + ".{{ext}}?" + file.id, ext) as ToString<ImgUrl>,
					width: (width: number): ToString<ImgUrl> => new ImgUrl(this.imgUrlPrefix + "/" + this.collection.collection + "." + id + "-" + width + "x@{{d}}." + focus + "-" + file.name + ".{{ext}}?" + file.id, ext) as ToString<ImgUrl>,
					height: (height: number): ToString<ImgUrl> => new ImgUrl(this.imgUrlPrefix + "/" + this.collection.collection + "." + id + "-x" + height + "@{{d}}." + focus + "-" + file.name + ".{{ext}}?" + file.id, ext) as ToString<ImgUrl>,
					named: (name: string): ToString<ImgUrl> => new ImgUrl(this.imgUrlPrefix + "/" + this.collection.collection + "." + id + "-~" + name + "@{{d}}." + focus + "-" + file.name + ".{{ext}}?" + file.id, ext) as ToString<ImgUrl>,
				}
			}
		});
	}
	get files(): Array<ImgCollection<METADATA>['files'][number]> { return this.collection.files }
}

export class ImgUrl implements ImgUrlInterface {
	protected ext = "webp";
	constructor(protected url: string, protected originalExtension?: string) {}
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

	x(resolution: ResolutionOptions): string {
		return this.url.replace("{{d}}", resolution.toString()).replace("{{ext}}", this.ext)
	}

	get x1() { return this.x(1) }
	get x2() { return this.x(2) }
	get x3() { return this.x(3) }
	get x4() { return this.x(4) }

	toString() { return this.x1 }
}