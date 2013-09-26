if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/mathf",
	"math/color",
	"math/vec2",
	"math/vec3",
	"math/mat4",
	"core/components/component"
    ],
    function( Class, Mathf, Color, Vec2, Vec3, Mat4, Component ){
        "use strict";
	
	
	var clamp = Mathf.clamp,
	    degsToRads =  Mathf.degsToRads;
	
        /**
	 * @class Camera
	 * @extends Component
	 * @brief camera is a device through which the player views the world
	 * @param Object options
	 */
        function Camera( opts ){
	    opts || ( opts = Class.OBJECT );
	    
            Component.call( this, "Camera");
	    
	    /**
	    * @property Color backgroundColor
	    * @memberof Camera
	    */
	    this.backgroundColor = opts.backgroundColor !== undefined ? opts.backgroundColor : new Color( 0.5, 0.5, 0.5 );
	    
	    /**
	    * @property Number width
	    * @brief client's screen width
	    * @memberof Camera
	    */
	    this.width = 960;
	    
	    /**
	    * @property Number height
	    * @brief client's screen height
	    * @memberof Camera
	    */
            this.height = 640;
	    
	    /**
	    * @property Number aspect
	    * @brief client's screen aspect
	    * @memberof Camera
	    */
            this.aspect = this.width / this.height;
	    
	    /**
	    * @property Number fov
	    * @memberof Camera
	    */
	    this.fov = opts.fov !== undefined ? opts.fov : 35;
	    
	    /**
	    * @property Number near
	    * @memberof Camera
	    */
            this.near = opts.near !== undefined ? opts.near : 0.1;
	    
	    /**
	    * @property Number far
	    * @memberof Camera
	    */
            this.far = opts.far !== undefined ? opts.far : 512;
            
	    /**
	    * @property Boolean orthographic
	    * @memberof Camera
	    */
            this.orthographic = opts.orthographic !== undefined ? !!opts.orthographic : false;
            
	    /**
	    * @property Number orthographicSize
	    * @brief half size of camera
	    * @memberof Camera
	    */
            this.orthographicSize = opts.orthographicSize !== undefined ? opts.orthographicSize : 2;
            
	    /**
	    * @property Number minOrthographicSize
	    * @brief min half size of camera
	    * @memberof Camera
	    */
            this.minOrthographicSize = opts.minOrthographicSize !== undefined ? opts.minOrthographicSize : 0.01;
            
	    /**
	    * @property Number maxOrthographicSize
	    * @brief max half size of camera
	    * @memberof Camera
	    */
            this.maxOrthographicSize = opts.maxOrthographicSize !== undefined ? opts.maxOrthographicSize : Infinity;
	    
	    this.projection = new Mat4;
	    this.view = new Mat4;
	    
            this._needsUpdate = true;
	    this._active = false;
	}
        
	Class.extend( Camera, Component );
	
	
	Camera.prototype.copy = function( other ){
	    
	    this.backgroundColor.copy( other.backgroundColor );
	    this.width = other.width;
	    this.height = other.height;
	    this.aspect = other.aspect;
	    
	    this.far = other.far;
	    this.near = other.near;
	    this.fov = other.fov;
	    
	    this.orthographic = other.orthographic;
	    this.orthographicSize = other.orthographicSize;
	    this.minOrthographicSize = other.minOrthographicSize;
	    this.maxOrthographicSize = other.maxOrthographicSize;
	    
	    this._needsUpdate = true;
	    
	    return this;
	};
	
	/**
	 * @method set
	 * @memberof Camera
	 * @param Number width
	 * @param Number height
	 */
	Camera.prototype.set = function( width, height ){
	    
	    this.width = width;
	    this.height = height;
            this.aspect = width / height;
	    this._needsUpdate = true;
	};
	
	/**
	 * @method setWidth
	 * @memberof Camera
	 * @param Number width
	 */
	Camera.prototype.setWidth = function( width ){
	    
	    this.width = width;
            this.aspect = width / this.height;
	    this._needsUpdate = true;
	};
	
	/**
	 * @method setHeight
	 * @memberof Camera
	 * @param Number height
	 */
	Camera.prototype.setHeight = function( height ){
	    
	    this.height = height;
            this.aspect = this.width / height;
	    this._needsUpdate = true;
	};
	
	/**
	 * @method setFov
	 * @memberof Camera
	 * @param Number value
	 */
	Camera.prototype.setFov = function( value ){
	    
	    this.fov = value;
	    this._needsUpdate = true;
	};
	
	/**
	 * @method setNear
	 * @memberof Camera
	 * @param Number value
	 */
	Camera.prototype.setNear = function( value ){
	    
	    this.near = value;
	    this._needsUpdate = true;
	};
	
	/**
	 * @method setFar
	 * @memberof Camera
	 * @param Number value
	 */
	Camera.prototype.setFar = function( value ){
	    
	    this.far = value;
	    this._needsUpdate = true;
	};
	
	/**
	 * @method setOrthographic
	 * @memberof Camera
	 * @param Boolean value
	 */
	Camera.prototype.setOrthographic = function( value ){
	    
	    this.orthographic = !!value;
	    this._needsUpdate = true;
	};
	
	/**
	 * @method toggleOrthographic
	 * @memberof Camera
	 */
	Camera.prototype.toggleOrthographic = function(){
	    
	    this.orthographic = !this.orthographic;
	    this._needsUpdate = true;
	};
	
	/**
	 * @method setOrthographicSize
	 * @memberof Camera
	 * @brief set half size of camera
	 * @param Number size
	 */
	Camera.prototype.setOrthographicSize = function( size ){
	    
	    this.orthographicSize = clamp( size, this.minOrthographicSize, this.maxOrthographicSize );
	    this._needsUpdate = true;
	};
	
	
	var MAT4 = new Mat4,
	    VEC3 = new Vec3;
	/**
	 * @method toWorld
	 * @memberof Camera
	 * @brief converts screen point to world space
	 * @param Vec2 v
	 * @param Vec3 out
	 * @return Vec3
	 */
	Camera.prototype.toWorld = function( v, out ){
	    out || ( out = new Vec3 );
	    
	    out.x = 2 * v.x / this.width - 1;
	    out.y = -2 * v.y / this.height + 1;
	    out.transformMat4( MAT4.mmul( this.projection, this.view ).inverse() );
	    out.z = this.near;
	    
	    return out;
	};
	
	/**
	 * @method toScreen
	 * @memberof Camera
	 * @brief converts world point to screen space
	 * @param Vec3 v
	 * @param Vec2 out
	 * @return Vec3
	 */
	Camera.prototype.toScreen = function( v, out ){
	    out || ( out = new Vec2 );
	    
	    VEC3.copy( v );
	    VEC3.transformMat4( MAT4.mmul( this.projection, this.view ) );
	    
	    out.x = ( ( VEC3.x + 1 ) * 0.5 ) * this.width;
	    out.y = ( ( 1 - VEC3.y ) * 0.5 ) * this.height;
	    
	    return v;
	};
	
	
	Camera.prototype.update = function(){
	    if( !this._active ) return;
	    
	    if( this._needsUpdate ){
		
		if( !this.orthographic ){
		    
		    this.projection.perspective( degsToRads( this.fov ), this.aspect, this.near, this.far );
		}
		else{
		    this.orthographicSize = clamp( this.orthographicSize, this.minOrthographicSize, this.maxOrthographicSize );
		    
		    var orthographicSize = this.orthographicSize,
			right = orthographicSize * this.aspect,
			left = -right,
			top = orthographicSize,
			bottom = -top;
		    
		    this.projection.orthographic( left, right, bottom, top, this.near, this.far );
		}
		
		this._needsUpdate = false;
	    }
	    
	    this.view.inverseMat( this.transform.matrixWorld );
	};
	
        
        return Camera;
    }
);