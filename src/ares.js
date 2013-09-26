if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define(
    function( require ){
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
	Ares.globalize = function(){
	    
	    for( var key in this ){
		window[ key ] = this[ key ];
	    }
	    window.Ares = this;
	};
	
	
	Ares.Class = require("base/class");
	Ares.Device = require("base/device");
	Ares.Dom = require("base/dom");
	Ares.ObjectPool = require("base/objectpool");
	Ares.Time = require("base/time");
	
	Ares.App = require("core/app/app");
	Ares.ClientApp = require("core/app/clientapp");
	Ares.Settings = require("core/app/settings");
	
	Ares.Asset = require("core/assets/asset");
	Ares.Assets = require("core/assets/assets");
	Ares.Mesh = require("core/assets/mesh");
	Ares.Material = require("core/assets/material");
	Ares.Texture = require("core/assets/texture");
	
	Ares.Animation = require("core/components/animation");
	Ares.Camera = require("core/components/camera");
	Ares.Component = require("core/components/component");
	Ares.Emitter = require("core/components/emitter");
	Ares.Light = require("core/components/light");
	Ares.MeshFilter = require("core/components/meshfilter");
	Ares.Script = require("core/components/script");
	Ares.Transform = require("core/components/transform");
	
	Ares.Input = require("core/input/input");
	
	Ares.Shader = require("core/rendering/shaders/shader");
	Ares.Shader_Unlit = require("core/rendering/shaders/shader_unlit");
	Ares.Shader_Vertexlit = require("core/rendering/shaders/shader_vertexlit");
	
	Ares.Canvas = require("core/rendering/canvas");
	Ares.WebGLRenderer = require("core/rendering/webglrenderer");
	
	Ares.OrbitCamera = require("core/scripts/orbitcamera");
	Ares.FlyingCamera = require("core/scripts/flyingcamera");
	
	Ares.GameObject = require("core/gameobject");
	Ares.Scene = require("core/scene");
	
	Ares.AABB2 = require("math/aabb2");
	Ares.AABB3 = require("math/aabb3");
	Ares.Color = require("math/color");
	Ares.Euler = require("math/euler");
	Ares.Mat2 = require("math/mat2");
	Ares.Mat3 = require("math/mat3");
	Ares.Mat32 = require("math/mat32");
	Ares.Mat4 = require("math/mat4");
	Ares.Mathf = require("math/mathf");
	Ares.Quat = require("math/quat");
	Ares.Ray2 = require("math/ray2");
	Ares.Vec2 = require("math/vec2");
	Ares.Vec3 = require("math/vec3");
	Ares.Vec4 = require("math/vec4");
	
	
	return Ares;
    }
);