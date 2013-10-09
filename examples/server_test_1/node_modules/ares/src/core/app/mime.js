if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
define([
        "base/class"
    ],
    function(Class) {
        "use strict";


        var http = require("http"),
            SPLITTER = /([^,]+)/g,
            TXT = "txt";

        /**
         * @class Type
         * @brief class for Mime Type
         * @param String extension
         * @param String type
         */

        function MimeType(extension, type) {

            /**
             * @property String ext
             * @memberof Type
             */
            this.extension = extension || "txt";

            /**
             * @property String type
             * @memberof Type
             */
            this.type = type || "text/plain";
        }


        /**
         * @class Mime
         * @extends Array
         * @brief class for handling Mime Types
         */

        function Mime() {

            Array.call(this);

            this._typeLookUp = {};
            this._extensionLookUp = {};
            this._typeHash = {};
            this._extensionHash = {};

            var key;
            for (key in DEFAULT_TYPES) this.register(key, DEFAULT_TYPES[key]);
        }

        Class.extend(Mime, Array);

        /**
         * @method register
         * @memberof Mime
         * @brief registers mime type, extensions string separated by commas or single, "jpg,jpeg" or "jpg"
         * @param String extensions
         * @param String type
         * @return this
         */
        Mime.prototype.register = function(extensions, type) {
            var typeLookUp = this._typeLookUp,
                extensionLookUp = this._extensionLookUp,
                typeHash = this._typeHash,
                extensionHash = this._extensionHash,
                mimeType, extension,
                i;

            extensions = (extensions).match(SPLITTER);

            for (i = extensions.length; i--;) {
                extension = extensions[i];
                mimeType = new MimeType(extension, type);

                typeLookUp[type] = extension;
                extensionLookUp[extension] = type;
                typeHash[type] = mimeType;
                extensionHash[extension] = mimeType;

                this.push(mimeType);
            }

            return this;
        };

        /**
         * @method unregisterExtension
         * @memberof Mime
         * @brief unregisters mime type by extension, extensions string separated by commas or single, "jpg,jpeg"
         * @param String extensions
         * @return this
         */
        Mime.prototype.unregisterExtension = function(extensions) {
            var typeLookUp = this._typeLookUp,
                extensionLookUp = this._extensionLookUp,
                typeHash = this._typeHash,
                extensionHash = this._extensionHash,
                mimeType, extension, type,
                i;

            extensions = (extensions).match(SPLITTER);

            for (i = extensions.length; i--;) {
                extension = extensions[i];
                mimeType = extensionHash[extension];
                if (!mimeType) {
                    throw "Mime.unregisterExtension: no MimeType with extension " + extension;
                    continue;
                }
                type = mimeType.type;

                typeLookUp[type] = undefined;
                extensionLookUp[extension] = undefined;
                typeHash[type] = undefined;
                extensionHash[extension] = undefined;

                this.splice(this.indexOf(mimeType), 1);
            }

            return this;
        };

        /**
         * @method lookUp
         * @memberof Mime
         * @brief looks up mime type by extension
         * @return String
         */
        Mime.prototype.lookUp = function(extension) {

            return this._extensionLookUp[extension]
        };


        var DEFAULT_TYPES = {
            "txt": "text/plain",
            "html": "text/html",
            "css": "text/css",
            "xml": "application/xml",
            "json": "application/json",
            "js": "application/javascript",
            "jpg,jpeg": "image/jpeg",
            "gif": "image/gif",
            "png": "image/png",
            "svg": "image/svg+xml",
            "ico": "image/x-icon",
            "m4v": "video/x-m4v",
            "pict,pict1,pict2": "image/x-quicktime",
            "pntg": "image/x-macpaint",
            "mp4": "video/mp4",
            "mov": "video/quicktime",
            "divx": "video/divx",
            "wma": "audio/x-ms-wma",
            "asx": "application/asx",
            "wmp": "application/x-ms-wmp",
            "wms": "application/x-ms-wms",
            "wmv": "video/x-ms-wmv",
            "asf": "video/x-ms-asf",
            "asf,wmv": "video/x-ms-asf-plugin",
            "avi,wma,wmv": "application/x-mplayer2",
            "mid,midi": "audio/midi",
            "webm": "video/webm",
            "flv": "video/flv",
            "nsv": "application/x-nsv-vp3-mp3",
            "mp3": "audio/mpeg",
            "wav": "audio/wav",
            "mpg,mpeg,mpe": "video/mpeg",
            "axv": "video/annodex",
            "axa": "audio/annodex",
            "anx": "application/annodex",
            "ogg": "application/x-ogg",
            "ogv": "video/ogg",
            "oga": "audio/ogg",
            "class,jar": "application/x-java-vm",
            "spl": "application/futuresplash",
            "swf": "application/x-shockwave-flash",
            "o1d": "application/o1d",
            "googletalk": "application/googletalk",
            "pdf": "application/pdf"
        };


        return new Mime;
    }
);
