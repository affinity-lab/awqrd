import type { IEntityRepository } from "../../../entity-repository-interface.ts";
import { Collection } from "../../storage/collection.ts";
import type { CollectionOptions, MetaField, ITmpFile } from "../../storage/helper/types.ts";
import type { Storage } from "../../storage/storage.ts";
import { type ImgFocus, type ImgRGB } from "./types.ts";
type ImageAttachmentMetadata = {
    title?: string;
    focus: ImgFocus;
    readonly width?: number;
    readonly height?: number;
    readonly color?: ImgRGB;
    readonly animated: boolean;
};
export declare class ImageCollection extends Collection<ImageAttachmentMetadata> {
    readonly writableMetaFields: Record<string, MetaField>;
    constructor(name: string, groupDefinition: {
        storage: Storage;
        group: string;
        entityRepository: IEntityRepository;
    }, rules: CollectionOptions);
    protected prepareFile(file: ITmpFile): Promise<{
        file: ITmpFile;
        metadata: ImageAttachmentMetadata;
    }>;
}
export {};
