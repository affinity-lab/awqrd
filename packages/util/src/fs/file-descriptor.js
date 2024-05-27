"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileDescriptor = void 0;
var fs = require("fs");
var mime = require("mime-types");
var path = require("path");
var sharp_1 = require("sharp");
var materialize_it_1 = require("../materialize-it");
/**
 * Represents a file descriptor.
 */
var FileDescriptor = function () {
    var _a;
    var _instanceExtraInitializers = [];
    var _get_stat_decorators;
    var _get_parsedPath_decorators;
    var _get_mimeType_decorators;
    var _get_isImage_decorators;
    var _get_image_decorators;
    return _a = /** @class */ (function () {
            function FileDescriptor(file) {
                this.file = __runInitializers(this, _instanceExtraInitializers);
                this.file = fs.realpathSync(file);
            }
            ;
            Object.defineProperty(FileDescriptor.prototype, "stat", {
                /**
                 * Retrieves the file stats asynchronously.
                 */
                get: function () { return fs.promises.stat(this.file).catch(function () { return null; }); },
                enumerable: false,
                configurable: true
            });
            ;
            Object.defineProperty(FileDescriptor.prototype, "size", {
                /**
                 * Retrieves the size of the file asynchronously.
                 */
                get: function () { return this.stat.then(function (stat) { return stat !== null ? stat.size : 0; }); },
                enumerable: false,
                configurable: true
            });
            ;
            Object.defineProperty(FileDescriptor.prototype, "exists", {
                /**
                 * Checks if the file exists asynchronously.
                 */
                get: function () { return this.stat.then(function (stat) { return stat !== null; }); },
                enumerable: false,
                configurable: true
            });
            ;
            Object.defineProperty(FileDescriptor.prototype, "name", {
                /**
                 * Retrieves the base name of the file.
                 */
                get: function () { return this.parsedPath.base; },
                enumerable: false,
                configurable: true
            });
            ;
            Object.defineProperty(FileDescriptor.prototype, "parsedPath", {
                /**
                 * Parses the path of the file.
                 */
                get: function () { return path.parse(this.file); },
                enumerable: false,
                configurable: true
            });
            ;
            Object.defineProperty(FileDescriptor.prototype, "mimeType", {
                /**
                 * Retrieves the MIME type of the file.
                 */
                get: function () { return mime.lookup(this.file); },
                enumerable: false,
                configurable: true
            });
            ;
            Object.defineProperty(FileDescriptor.prototype, "isImage", {
                /**
                 * Checks if the file is an image.
                 */
                get: function () { return this.mimeType.toString().substring(0, 6) === "image/"; },
                enumerable: false,
                configurable: true
            });
            ;
            Object.defineProperty(FileDescriptor.prototype, "image", {
                /**
                 * Retrieves image metadata and stats if the file is an image.
                 */
                get: function () {
                    sharp_1.default.cache({ files: 0 });
                    if (!this.isImage) {
                        return Promise.resolve(null);
                    }
                    var img = (0, sharp_1.default)(this.file);
                    return Promise.all([img.metadata(), img.stats()])
                        .then(function (res) { return ({ meta: res[0], stats: res[1] }); });
                },
                enumerable: false,
                configurable: true
            });
            ;
            return FileDescriptor;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _get_stat_decorators = [materialize_it_1.MaterializeIt];
            _get_parsedPath_decorators = [materialize_it_1.MaterializeIt];
            _get_mimeType_decorators = [materialize_it_1.MaterializeIt];
            _get_isImage_decorators = [materialize_it_1.MaterializeIt];
            _get_image_decorators = [materialize_it_1.MaterializeIt];
            __esDecorate(_a, null, _get_stat_decorators, { kind: "getter", name: "stat", static: false, private: false, access: { has: function (obj) { return "stat" in obj; }, get: function (obj) { return obj.stat; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_parsedPath_decorators, { kind: "getter", name: "parsedPath", static: false, private: false, access: { has: function (obj) { return "parsedPath" in obj; }, get: function (obj) { return obj.parsedPath; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_mimeType_decorators, { kind: "getter", name: "mimeType", static: false, private: false, access: { has: function (obj) { return "mimeType" in obj; }, get: function (obj) { return obj.mimeType; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_isImage_decorators, { kind: "getter", name: "isImage", static: false, private: false, access: { has: function (obj) { return "isImage" in obj; }, get: function (obj) { return obj.isImage; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_image_decorators, { kind: "getter", name: "image", static: false, private: false, access: { has: function (obj) { return "image" in obj; }, get: function (obj) { return obj.image; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.FileDescriptor = FileDescriptor;
