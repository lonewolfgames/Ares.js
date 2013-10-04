if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
define([
        "base/class",
        "math/color",
        "math/vec2",
        "core/rendering/shaders/shader_unlit"
    ],
    function(Class, Color, Vec2, Shader_Unlit) {
        "use strict";


        /**
         * @class Material
         * @extends Class
         * @brief material class
         * @param Object options
         */

        function Material(opts) {
            opts || (opts = Class.OBJECT);

            Class.call(this);

            /**
             * @property Number alpha
             * @memberof Material
             */
            this.alpha = opts.alpha !== undefined ? opts.alpha : 1;

            /**
             * @property Color color
             * @memberof Material
             */
            this.color = opts.color !== undefined ? opts.color : new Color(0, 0, 0);

            /**
             * @property Color specular
             * @memberof Material
             */
            this.specular = opts.specular !== undefined ? opts.specular : new Color(0.5, 0.5, 0.5);

            /**
             * @property Color emissive
             * @memberof Material
             */
            this.emissive = opts.emissive !== undefined ? opts.emissive : new Color(0, 0, 0);

            /**
             * @property Number shininess
             * @memberof Material
             */
            this.shininess = opts.shininess !== undefined ? opts.shininess : 0.5;

            /**
             * @property Texture mainTexture
             * @memberof Material
             */
            this.mainTexture = opts.mainTexture !== undefined ? opts.mainTexture : undefined;

            /**
             * @property Vec2 mainTextureOffset
             * @memberof Material
             */
            this.mainTextureOffset = opts.mainTextureOffset !== undefined ? opts.mainTextureOffset : new Vec2;

            /**
             * @property Vec2 mainTextureScale
             * @memberof Material
             */
            this.mainTextureScale = opts.mainTextureScale !== undefined ? opts.mainTextureScale : new Vec2(1, 1);

            /**
             * @property Shader shader
             * @memberof Material
             */
            this.shader = opts.shader !== undefined ? opts.shader : new Shader_Unlit;
        }

        Class.extend(Material, Class);


        return Material;
    }
);
