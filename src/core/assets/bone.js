if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"math/mathf",
	"math/vec3",
	"math/quat",
	"math/mat4"
    ],
    function( Class, Mathf, Vec3, Quat, Mat4 ){
	"use strict";
	
	
	var EPSILON = Mathf.EPSILON;
	
	/**
	 * @class Bone
	 * @extends Class
	 * @brief bones position, rotation, and scale
	 * @param Object options
	 */
	function Bone( opts ){
	    opts || ( opts = Class.OBJECT );
	    
	    Class.call( this, "Bone" );
	    
	    /**
	    * @property String name
	    * @memberof Bone
	    */
	    this.name = opts.name !== undefined ? opts.name : "Bone-"+ this._id;
	    
	    /**
	    * @property Number parentIndex
	    * @memberof Bone
	    */
	    this.parentIndex = opts.parentIndex !== undefined ? opts.parentIndex : -1;
	    
	    /**
	    * @property Boolean skinned
	    * @memberof Bone
	    */
	    this.skinned = opts.skinned !== undefined ? !!opts.skinned : false;
	    
	    /**
	    * @property Boolean inheritRotation
	    * @memberof Bone
	    */
	    this.inheritRotation = opts.inheritRotation !== undefined ? !!opts.inheritRotation : false;
	    
	    /**
	    * @property Boolean inheritScale
	    * @memberof Bone
	    */
	    this.inheritScale = opts.inheritScale !== undefined ? !!opts.inheritScale : false;
	    
	    /**
	    * @property Bone parent
	    * @memberof Bone
	    */
	    this.parent = undefined;
	    
	    /**
	    * @property Vec3 position
	    * @memberof Bone
	    */
	    this.position = new Vec3;
	    
	    /**
	    * @property Number rotation
	    * @memberof Bone
	    */
	    this.rotation = new Quat;
	    
	    /**
	    * @property Vec3 scale
	    * @memberof Bone
	    */
	    this.scale = new Vec3( 1, 1, 1 );
	    
	    /**
	    * @property Mat4 matrix
	    * @memberof Bone
	    */
	    this.matrix = new Mat4;
	    
	    /**
	    * @property Mat4 matrixWorld
	    * @memberof Bone
	    */
	    this.matrixWorld = new Mat4;
	    
	    /**
	    * @property Mat4 matrixBone
	    * @memberof Bone
	    */
	    this.matrixBone = new Mat4;
	    
	    /**
	    * @property Mat4 bindPose
	    * @memberof Bone
	    */
	    this.bindPose = opts.bindPose !== undefined ? opts.bindPose : new Mat4;
	}
        
	Class.extend( Bone, Class );
	
	
	Bone.prototype.copy = function( other ){
	    var children = other.children, child, gameObject,
		i;
	    
	    this.name = other.name;
	    this.parentIndex = other.parentIndex;
	    this.parent = other.parent;
	    
	    this.skinned = other.skinned;
	    this.inheritRotation = other.inheritRotation;
	    this.inheritScale = other.inheritScale;
	    
	    this.bindPose.copy( other.bindPose );
	    this.position.copy( other.position );
	    this.scale.copy( other.scale );
	    this.rotation.copy( other.rotation );
	    
	    return this;
	};
        
        /**
	 * @method toWorld
	 * @memberof Bone
	 * @brief returns vector in this Bone's world space
	 * @param Vec3 v
	 * @return Vec3
	 */
	Bone.prototype.toWorld = function( v ){
	    
	    return v.transformMat4( this.matrixWorld );
	};
        
        /**
	 * @method toWorld
	 * @memberof Bone
	 * @brief returns vector in this Bone's local space
	 * @param Vec3 v
	 * @return Vec3
	 */
	Bone.prototype.toLocal = function(){
	    var mat = new Mat4;
	    
	    return function( v ){
		
		return v.transformMat4( mat.inverseMat( this.matrixWorld ) );
	    };
	}();
	
	
	return Bone;
    }
);