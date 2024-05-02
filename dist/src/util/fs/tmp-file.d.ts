/// <reference types="node" />
import { Buffer } from "buffer";
export declare class TmpFile {
    file: string;
    get filename(): string;
    constructor(file: string);
    release(): void | Promise<void>;
}
/**
 * Factory class for creating temporary files.
 */
export declare class TmpFileFactory {
    private path;
    constructor(path: string);
    get targetDir(): Promise<string>;
    createFromFile(file: File, removeOriginal?: boolean): Promise<TmpFile>;
    createFromBuffer(filename: string, buffer: Buffer): Promise<TmpFile>;
    createFromFilePath(file: string, removeOriginal?: boolean): Promise<TmpFile>;
}
