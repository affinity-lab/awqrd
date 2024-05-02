import { type Collection } from "./collection.ts";
import type { AttachmentObject } from "./helper/types.ts";
export declare class Attachment<METADATA extends Record<string, any>> implements AttachmentObject {
    #private;
    metadata: METADATA;
    get size(): number;
    get id(): string;
    get name(): string;
    get collection(): Collection<METADATA>;
    get entityId(): number;
    constructor(attachmentObject: AttachmentObject, collection: Collection<METADATA>, entityId: number);
    toJSON(): {
        metadata: METADATA;
        name: string;
        id: string;
        size: number;
    };
    saveMetaData(): Promise<void>;
    setPositions(position: number): Promise<void>;
    delete(): Promise<void>;
    rename(name: string): Promise<void>;
}
