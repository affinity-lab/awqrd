import jwt from "jsonwebtoken";
/** Wrapper class for encoding and decoding JSON Web Tokens. */
export declare class Jwt<T> {
    private readonly secret;
    private readonly expires?;
    private readonly algorithm;
    constructor(secret: string, expires?: string | undefined, algorithm?: jwt.Algorithm);
    decode(token: string | undefined): T | undefined;
    encode(payload: T, expires?: string): string;
    static getStringContent(token: string | undefined): string | undefined;
    static getContent(token: string | undefined): undefined;
}
