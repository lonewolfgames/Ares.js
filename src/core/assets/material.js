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
        
        
        Material.prototype.copy = function(other) {
            
            this.alpha = other.alpha;
            this.color.copy(other.color);
            this.specular.copy(other.specular);
            this.emissive.copy(other.emissive);
            this.shininess = other.shininess
            this.mainTexture = other.mainTexture;
            this.mainTextureOffset.copy(other.mainTextureOffset);
            this.mainTextureScale.copy(other.mainTextureScale);
            this.shader = other.shader !== undefined ? other.shader : new Shader_Unlit;
        };

        /**
        * @method toJSON
        * @memberof Material
        * @brief returns this as JSON
        * @return Object
        */
        Material.prototype.toJSON = function() {
            
            return {
                type: "Material",
                alpha: this.alpha,
                color: this.color.toJSON(),
                specular: this.specular.toJSON(),
                emissive: this.emissive.toJSON(),
                shininess: this.shininess,
                mainTexture: this.mainTexture,
                mainTextureOffset: this.mainTextureOffset.toJSON(),
                mainTextureScale: this.mainTextureScale.toJSON(),
                shader: this.shader.toJSON()
            };
        };

        /**
        * @method fromJSON
        * @memberof Material
        * @brief returns this from JSON object
        * @param Object json
        * @return Object
        */
        Material.prototype.fromJSON = function(json) {
            
            this.alpha = json.alpha;
            this.color.fromJSON(json.color);
            this.specular.fromJSON(json.specular);
            this.emissive.fromJSON(json.emissive);
            this.shininess = json.shininess
            this.mainTexture = json.mainTexture;
            this.mainTextureOffset.fromJSON(json.mainTextureOffset);
            this.mainTextureScale.fromJSON(json.mainTextureScale);
            this.shader = json.shader !== undefined ? json.shader : new Shader_Unlit;
        };


        return Material;
    }
);
