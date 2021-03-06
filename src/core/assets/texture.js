if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
define([
        "base/class"
    ],
    function(Class) {
        "use strict";


        /**
        * @class Texture
        * @extends Class
        * @brief class for texture handling
        * @param Object options
        */

        function Texture(opts) {
            opts || (opts = Class.OBJECT);

            Class.call(this);

            /**
            * @property Asset image
            * @memberof Texture
            */
            this.image = opts.image;

            /**
            * @property Number anisotropy
            * @memberof Texture
            */
            this.anisotropy = opts.anisotropy !== undefined ? opts.anisotropy : 1;

            /**
            * @property String format
            * @memberof Texture
            * @brief format mode for textures, defaults to "RGBA", types - "RGB", "RGB565", "RGB5_A1", "RGBA", or "RGBA4"
            */
            this.format = opts.format !== undefined ? opts.format : "RGBA";

            /**
            * @property String minFilter
            * @memberof Texture
            * @brief TEXTURE_MIN_FILTER for textures, defaults to "LINEAR"
            */
            this.minFilter = opts.minFilter !== undefined ? opts.minFilter : "LINEAR";

            /**
            * @property String magFilter
            * @memberof Texture
            * @brief TEXTURE_MAG_FILTER for textures, defaults to "LINEAR"
            */
            this.magFilter = opts.magFilter !== undefined ? opts.magFilter : "LINEAR";


            this._needsUpdate = true;
        }

        Class.extend(Texture, Class);

        /**
        * @method setAnisotropy
        * @memberof Texture
        * @brief set anisotropy value
        * @param Number value
        */
        Texture.prototype.setAnisotropy = function(value) {

            this.anisotropy = value;
            this._needsUpdate = true;
        };

        /**
        * @method setMinFilter
        * @memberof Texture
        * @brief set minFilter, "NEAREST_MIPMAP_NEAREST", "LINEAR_MIPMAP_NEAREST", "NEAREST_MIPMAP_LINEAR", "LINEAR_MIPMAP_LINEAR", "NEAREST", "LINEAR"
        * @param String value
        */
        Texture.prototype.setMinFilter = function(value) {

            this.minFilter = value;
            this._needsUpdate = true;
        };

        /**
        * @method setMagFilter
        * @memberof Texture
        * @brief set magFilter, "NEAREST", "LINEAR"
        * @param String value
        */
        Texture.prototype.setMagFilter = function(value) {

            this.magFilter = value;
            this._needsUpdate = true;
        };

        /**
        * @method setFormat
        * @memberof Texture
        * @brief set texture format, "RGB", "RGB565", "RGB5_A1", "RGBA", or "RGBA4"
        * @param String value
        */
        Texture.prototype.setFormat = function(value) {

            this.format = value;
            this._needsUpdate = true;
        };


        return Texture;
    }
);
