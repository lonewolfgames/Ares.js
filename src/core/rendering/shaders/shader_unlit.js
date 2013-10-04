if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
define([
        "base/class",
        "core/rendering/shaders/shader"
    ],
    function(Class, Shader) {
        "use strict";


        /**
         * @class Shader_Unlit
         * @extends Class
         * @brief one of the simplest shaders, no lighting is calculated
         */

        function Shader_Unlit() {

            Shader.call(this, {
                options: {
                    lighting: false
                },
                vertexShaderHeader: [
                    "uniform mat4 uModelView;",
                    "uniform mat4 uProj;",

                    "uniform vec4 uMainTextureOffset;",
                    "uniform vec4 uColor;",

                    "attribute vec3 aVertexPosition;",
                    "attribute vec2 aVertexUv;",

                    "varying vec4 vColor;",
                    "varying vec2 vVertexUv;",

                    Shader.getUvOffset,
                ].join("\n"),

                vertexShaderMain: [
                    "gl_Position = uProj * vertexPosition;",

                    "vColor = uColor;",
                    "vVertexUv = getUvOffset( aVertexUv, uMainTextureOffset );",
                ].join("\n"),

                fragmentShaderHeader: [
                    "uniform sampler2D uMainTexture;",

                    "varying vec4 vColor;",
                    "varying vec2 vVertexUv;",
                ].join("\n"),

                fragmentShaderMain: [
                    "vec4 mainTexture = texture2D( uMainTexture, vVertexUv );",

                    "gl_FragColor = vec4( mainTexture.xyz * vColor.xyz, mainTexture.w * vColor.w );",
                ].join("\n")
            });
        }

        Class.extend(Shader_Unlit, Shader);


        return Shader_Unlit;
    }
);
