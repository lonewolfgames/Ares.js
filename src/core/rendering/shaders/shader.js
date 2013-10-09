if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
define([
        "base/class"
    ],
    function(Class) {
        "use strict";


        /**
        * @class Shader
        * @extends Class
        * @brief base class for shader handling
        */

        function Shader(opts) {

            Class.call(this);

            /**
            * @property String vertexShaderHeader
            * @memberof Shader
            */
            this.vertexShaderHeader = opts.vertexShaderHeader;

            /**
            * @property String vertexShaderMain
            * @memberof Shader
            */
            this.vertexShaderMain = opts.vertexShaderMain;

            /**
            * @property String fragmentShaderHeader
            * @memberof Shader
            */
            this.fragmentShaderHeader = opts.fragmentShaderHeader;

            /**
            * @property String fragmentShaderMain
            * @memberof Shader
            */
            this.fragmentShaderMain = opts.fragmentShaderMain;

            /**
            * @property Object options
            * @memberof Shader
            */
            this.options = opts.options || {};


            this._needsUpdate = true;
        }

        Class.extend(Shader, Class);
        
        /**
        * @method toJSON
        * @memberof Shader
        * @brief returns this as JSON
        * @return Object
        */
        Shader.prototype.toJSON = function() {
            
            return {
                type: "Shader",
                vertexShaderHeader: this.vertexShaderHeader,
                vertexShaderMain: this.vertexShaderMain,
                fragmentShaderHeader: this.fragmentShaderHeader,
                fragmentShaderMain: this.fragmentShaderMain,
                options: this.options
            };
        };

        /**
        * @method fromJSON
        * @memberof Shader
        * @brief returns this from JSON object
        * @param Object json
        * @return Object
        */
        Shader.prototype.fromJSON = function(json) {
            
            this.vertexShaderHeader = json.vertexShaderHeader;
            this.vertexShaderMain = json.vertexShaderMain;
            this.fragmentShaderHeader = json.fragmentShaderHeader;
            this.fragmentShaderMain = json.fragmentShaderMain;
            this.options = json.vertexShaderHeaoptionsder;
        };

        Shader.modelView_uModelView = "mat4 modelView = uModelView;\n";
        Shader.modelView = "mat4 modelView = uView * uModel;\n";

        Shader.vertexPosition = "vec4 vertexPosition = modelView * vec4( aVertexPosition, 1.0 );\n";

        Shader.getUvOffset = [
            "vec2 getUvOffset( vec2 uv, vec4 offset ){",
                "return vec2( uv.x * offset.z, uv.y * offset.w ) + offset.xy;",
            "}",
        ].join("\n");

        Shader.getNormalMat = [
            "\n",
            "mat3 getNormalMat( mat4 mat ){",
                "return mat3( mat[0][0], mat[1][0], mat[2][0], mat[0][1], mat[1][1], mat[2][1], mat[0][2], mat[1][2], mat[2][2] );",
            "}",
            "\n",
        ].join("\n");


        Shader.lightsHeader = function(POINT, DIR, SPOT, HEMI) {
            var usePOINT = POINT > 0,
                useDIR = DIR > 0,
                useSPOT = SPOT > 0,
                useHEMI = HEMI > 0;

            return [
                usePOINT ? "uniform vec3 uPointLight_position[" + POINT + "];" : "",
                usePOINT ? "uniform vec3 uPointLight_color[" + POINT + "];" : "",
                usePOINT ? "uniform vec3 uPointLight_attenuation[" + POINT + "];" : "",

                ouseDIR ? "uniform vec3 uDirLight_direction[" + DIR + "];" : "",
                ouseDIR ? "uniform vec3 uDirLight_color[" + DIR + "];" : "",

                useSPOT ? "uniform vec3 uSpotLight_direction[" + SPOT + "];" : "",
                useSPOT ? "uniform vec3 uSpotLight_position[" + SPOT + "];" : "",
                useSPOT ? "uniform vec3 uSpotLight_color[" + SPOT + "];" : "",

                useHEMI ? "uniform vec3 uHemiLight_direction[" + HEMI + "];" : "",
                useHEMI ? "uniform vec3 uHemiLight_color[" + HEMI + "];" : "",
            ].join("\n");
        };

        Shader.getLighting = function(POINT, DIR, SPOT, HEMI) {

            return [
                "\n",

                "\n"
            ].join("\n");
        };


        Shader.bonesHeader = function(BONES) {
            return [
                "\n",
                "attribute vec3 aBoneWeight;",
                "attribute vec3 aBoneIndex;",

                "uniform mat4 uBone[" + BONES + "];",

                "mat4 getBoneMat(){",
                    "mat4 result = aBoneWeight.x * uBone[ int( aBoneIndex.x ) ];",
                    "result = result + aBoneWeight.y * uBone[ int( aBoneIndex.y ) ];",
                    "result = result + aBoneWeight.z * uBone[ int( aBoneIndex.z ) ];",
                    "return result;",
                "}",
                "\n"
            ].join("\n");
        };

        Shader.bonesMain = "modelView = modelView * getBoneMat();\n";


        return Shader;
    }
);
