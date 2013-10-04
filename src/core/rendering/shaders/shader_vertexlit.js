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
         * @class Shader_Vertexlit
         * @extends Class
         * @brief one of the simplest shaders, lighting is calculated per vertex
         */

        function Shader_Vertexlit() {

            Shader.call(this, {
                options: {
                    lighting: true
                },
                vertexShaderHeader: [
                    "uniform mat4 uModel;",
                    "uniform mat4 uView;",
                    "uniform mat4 uProj;",

                    "uniform vec4 uMainTextureOffset;",
                    "uniform vec4 uColor;",

                    "attribute vec3 aVertexPosition;",
                    "attribute vec3 aVertexNormal;",
                    "attribute vec2 aVertexUv;",

                    "varying vec4 vColor;",
                    "varying vec2 vVertexUv;",
                    "varying vec3 vLighting;",

                    Shader.getUvOffset,
                    Shader.getNormalMat,
                ].join("\n"),

                vertexShaderMain: [
                    "gl_Position = uProj * vertexPosition;",

                    "mat3 normalMatrix = getNormalMat( modelView );",

                    "vec3 lightPos = vec3( 0.5, 0.5, 1.0 );",
                    "vec3 normal = normalize( aVertexNormal * normalMatrix );",
                    "vec3 lightDir = normalize( lightPos - vertexPosition.xyz );",
                    "vec3 eyeDir = normalize( -vertexPosition.xyz );",
                    "vec3 reflectDir = reflect(-lightDir, normal);",

                    "float shininess = 8.0;",
                    "vec3 specularColor = vec3(1.0, 1.0, 1.0);",
                    "vec3 lightColor = vec3(1.0, 1.0, 1.0);",
                    "vec3 ambientLight = vec3(0.15, 0.15, 0.15);",

                    "float specularLevel = 0.5;",
                    "float specularFactor = pow(clamp(dot(reflectDir, eyeDir), 0.0, 1.0), shininess) * specularLevel;",
                    "float lightFactor = max(dot(lightDir, normal), 0.0);",

                    "vLighting = ambientLight + ( lightColor * lightFactor ) + ( specularColor * specularFactor );",

                    "vColor = uColor;",
                    "vVertexUv = getUvOffset( aVertexUv, uMainTextureOffset );",
                ].join("\n"),

                fragmentShaderHeader: [
                    "uniform sampler2D uMainTexture;",

                    "varying vec4 vColor;",
                    "varying vec2 vVertexUv;",
                    "varying vec3 vLighting;",
                ].join("\n"),

                fragmentShaderMain: [
                    "vec4 mainTexture = texture2D( uMainTexture, vVertexUv );",

                    "gl_FragColor = vec4( mainTexture.xyz * vColor.xyz * vLighting, mainTexture.w * vColor.w );",
                ].join("\n")
            });
        }

        Class.extend(Shader_Vertexlit, Shader);


        return Shader_Vertexlit;
    }
);
