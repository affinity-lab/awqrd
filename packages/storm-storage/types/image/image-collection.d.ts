import { EntityRepositoryInterface } from "@affinity-lab/storm";
import { Collection } from "../collection";
import type { CollectionOptions, ITmpFile, MetaField } from "../helper/types";
import type { Storage } from "../storage";
import { type ImgFocus, type ImgRGB } from "./types";
type ImageAttachmentMetadata = {
    title?: string;
    focus: ImgFocus;
    readonly width?: number;
    readonly height?: number;
    readonly color?: ImgRGB;
    readonly animated: boolean;
};
/**
 * Collection for image attachments
 */
export declare class ImageCollection extends Collection<ImageAttachmentMetadata> {
    readonly writableMetaFields: Record<string, MetaField>;
    constructor(name: string, groupDefinition: {
        storage: Storage;
        group: string;
        entityRepository: EntityRepositoryInterface;
    }, rules: CollectionOptions);
    protected prepareFile(file: ITmpFile): Promise<{
        file: ITmpFile;
        metadata: ImageAttachmentMetadata;
    }>;
}
export {};
