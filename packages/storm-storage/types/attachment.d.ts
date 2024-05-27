import { type Collection } from "./collection";
import type { AttachmentObject } from "./helper/types";
export declare class Attachment<METADATA extends Record<string, any>> implements AttachmentObject {
    #private;
    /**
     * The metadata of the attachment
     */
    metadata: METADATA;
    /**
     * The file size of the attachment
     */
    get size(): number;
    /**
     * The id of the attachment
     */
    get id(): string;
    /**
     * The filename of the attachment
     */
    get name(): string;
    /**
     * The collection of the attachment
     */
    get collection(): Collection<METADATA>;
    /**
     * The entity id of the attachment
     */
    get entityId(): number;
    constructor(attachmentObject: AttachmentObject, collection: Collection<METADATA>, entityId: number);
    toJSON(): {
        metadata: METADATA;
        name: string;
        id: string;
        size: number;
    };
    /**
     * Save the metadata of the attachment
     */
    saveMetaData(): Promise<void>;
    /**
     * Set the position of the attachment
     * @param position
     */
    setPositions(position: number): Promise<void>;
    /**
     * Delete the attachment
     */
    delete(): Promise<void>;
    /**
     * Rename the attachment
     * @param name
     */
    rename(name: string): Promise<void>;
}
