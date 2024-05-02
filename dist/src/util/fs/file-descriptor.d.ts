/// <reference types="node" />
/// <reference types="node" />
import * as fs from "fs";
import * as path from "path";
import sharp from "sharp";
/**
 * Represents a file descriptor.
 */
export declare class FileDescriptor {
    readonly file: string;
    constructor(file: string);
    /**
     * Retrieves the file stats asynchronously.
     */
    get stat(): Promise<fs.Stats | null>;
    /**
     * Retrieves the size of the file asynchronously.
     */
    get size(): Promise<number>;
    /**
     * Checks if the file exists asynchronously.
     */
    get exists(): Promise<boolean>;
    /**
     * Retrieves the base name of the file.
     */
    get name(): string;
    /**
     * Parses the path of the file.
     */
    get parsedPath(): path.ParsedPath;
    /**
     * Retrieves the MIME type of the file.
     */
    get mimeType(): string | false;
    /**
     * Checks if the file is an image.
     */
    get isImage(): boolean;
    /**
     * Retrieves image metadata and stats if the file is an image.
     */
    get image(): Promise<{
        meta: sharp.Metadata;
        stats: sharp.Stats;
    } | null>;
}
