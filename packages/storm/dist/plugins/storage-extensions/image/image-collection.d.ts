import type { IEntityRepository } from "../../../entity-repository-interface";
import { Collection } from "../../storage/collection";
import type { CollectionOptions, MetaField, ITmpFile } from "../../storage/helper/types";
import type { Storage } from "../../storage/storage";
import { type ImgFocus, type ImgRGB } from "./types";
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
