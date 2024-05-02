"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stormStorageServerHono = exports.filePathFromUrl = void 0;
const bun_1 = require("hono/bun");
function filePathFromUrl(path) {
    let segments = path.split('/');
    let file = segments.pop();
    let collection = segments.pop();
    segments = collection.split(".");
    let c_id = segments.pop();
    let c_name = segments.join(".");
    return `${c_name}/${c_id.slice(0, 2)}/${c_id.slice(2, 4)}/${c_id.slice(4, 6)}/${file}`;
}
exports.filePathFromUrl = filePathFromUrl;
//todo: Add guards option
function stormStorageServerHono(app, path, prefix) {
    app.get(`${prefix}*`, (0, bun_1.serveStatic)({
        root: path,
        rewriteRequestPath: (path) => filePathFromUrl(path)
    }));
}
exports.stormStorageServerHono = stormStorageServerHono;
