var requirejs = require("requirejs");

requirejs.config({
    baseUrl: __dirname +"/"
});

if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
define(
    function(require) {
        "use strict";

        /**
        * @library Ares.js
        * @version 0.0.1
        * @brief WebGL/Canvas Javascript Game Engine
        */

        /**
        * @class Ares
        * @brief namespace
        */
        var Ares = {};

        /**
        * @method globalize
        * @memberof Ares
        * @brief globalizes Ares Classes
        */
        Ares.globalize = function() {

            for (var key in this) {
                window[key] = this[key];
            }
            window.Ares = this;
        };

        Ares.Phys2D = requirejs("phys2d/phys2d");
        
        Ares.Class = requirejs("base/class");
        Ares.ObjectPool = requirejs("base/objectpool");
        Ares.Time = requirejs("base/time");

        Ares.App = requirejs("core/app/app");
        Ares.ServerApp = requirejs("core/app/serverapp");
        Ares.Loop = requirejs("core/app/loop");
        Ares.Mime = requirejs("core/app/mime");
        Ares.Settings = requirejs("core/app/settings");

        Ares.Asset = requirejs("core/assets/asset");
        Ares.Assets = requirejs("core/assets/assets");
        Ares.Mesh = requirejs("core/assets/mesh");
        Ares.Material = requirejs("core/assets/material");
        Ares.Texture = requirejs("core/assets/texture");

        Ares.Animation = requirejs("core/components/animation");
        Ares.Camera = requirejs("core/components/camera");
        Ares.Component = requirejs("core/components/component");
        Ares.Emitter = requirejs("core/components/emitter");
        Ares.Light = requirejs("core/components/light");
        Ares.MeshFilter = requirejs("core/components/meshfilter");
        Ares.Script = requirejs("core/components/script");
        Ares.Transform = requirejs("core/components/transform");

        Ares.GameObject = requirejs("core/gameobject");
        Ares.Scene = requirejs("core/scene");

        Ares.AABB2 = requirejs("math/aabb2");
        Ares.AABB3 = requirejs("math/aabb3");
        Ares.Color = requirejs("math/color");
        Ares.Euler = requirejs("math/euler");
        Ares.Mat2 = requirejs("math/mat2");
        Ares.Mat3 = requirejs("math/mat3");
        Ares.Mat32 = requirejs("math/mat32");
        Ares.Mat4 = requirejs("math/mat4");
        Ares.Mathf = requirejs("math/mathf");
        Ares.Quat = requirejs("math/quat");
        Ares.Ray2 = requirejs("math/ray2");
        Ares.Vec2 = requirejs("math/vec2");
        Ares.Vec3 = requirejs("math/vec3");
        Ares.Vec4 = requirejs("math/vec4");


        return Ares;
    }
);
