if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/time",
	"math/mathf",
	"math/vec2",
	"math/vec3",
	"math/vec4",
	"math/quat",
	"math/mat4",
	"math/color",
	"core/components/component"
    ],
    function( Class, Time, Mathf, Vec2, Vec3, Vec4, Quat, Mat4, Color, Component ){
	"use strict";
	
	
	var floor = Math.floor,
	    min = Math.min,
	    clamp01 = Mathf.clamp01;
	
	/**
	 * @class Animation
	 * @extends Component
	 */
	function Animation( opts ){
	    opts || ( opts = Class.OBJECT );
	    
	    Component.call( this, "Animation");
	    
	    /**
	    * @property String current
	    * @brief current animation
	    * @memberof Animation
	    */
	    this.current = opts.current || "idle";
	    
	    /**
	    * @property Number mode
	    * @brief animation playback type ( 0 - Animation.ONCE, 1 - Animation.LOOP, or 2 - Animation.PINGPONG )
	    * @memberof Animation
	    */
	    this.mode = opts.mode || LOOP;
	    
	    /**
	    * @property Boolean playing
	    * @brief is playing animation
	    * @memberof Animation
	    */
	    this.playing = opts.playing !== undefined ? !!opts.playing : true;
	    
	    /**
	    * @property Number rate
	    * @brief rate of the animation
	    * @memberof Animation
	    */
	    this.rate = opts.rate || 1/60;
	    
	    /**
	    * @property Number frame
	    * @memberof Animation
	    */
	    this.frame = 0;
	    
	    /**
	    * @property Number order
	    * @memberof Animation
	    */
	    this.order = opts.order || 1;
	    
	    /**
	    * @property Array bones
	    * @brief every animation copies bones from MeshAsset to allow indepenent animations
	    * @memberof Animation
	    */
	    this.bones = [];
	    this._boneHash = {};
	    
	    this._time = 0;
	    this._lastFrame = this.frame;
	}
        
	Class.extend( Animation, Component );
	
	
	Animation.prototype.init = function(){
	    var meshfilter = this.meshfilter,
		mesh = meshfilter.mesh, meshBones = mesh.bones, meshBone,
		boneHash = this._boneHash, bones = this.bones, bonei, bonej,
		i, il, j, jl;
	    
	    if( !meshBones.length ) return;
	    
	    for( i = meshBones.length; i--; ){
		meshBone = meshBones[i].clone();
		
		bones[i] = meshBone;
		boneHash[ meshBone.name ] = meshBone;
	    }
	    for( i = 0, il = bones.length; i < il; i++ ){
		bonei = bones[i];
		
		for( j = 0, jl = bones.length; j < jl; j++ ){
		    bonej = bones[j];
		    if( bonej.parentIndex === i ) bonej.parent = bonei;
		}
	    }
	    
	    bones[0].parent = this.transform;
	};
	
	
	var POSITION = new Vec3, LAST_POSITION = new Vec3,
	    ROTATION = new Quat, LAST_ROTATION = new Quat,
	    SCALE = new Vec3, LAST_SCALE = new Vec3,
	    MATRIX = new Mat4;
	
	Animation.prototype.update = function(){
	    var bones = this.bones;
	    
	    if( !this.playing || !bones ) return;
	    
	    var meshfilter = this.meshfilter, mesh = meshfilter.mesh, animations = mesh.animations,
		animation = animations[ this.current ];
	    
	    if( !animation ) return;
	    
	    var dt = Time.delta,
		frames = animation.length, length = frames - 1,
		mode = this.mode, order = this.order, time, frame = this.frame, lastFrame = this._lastFrame, alpha,
		frameState, lastFrameState, bone, matrixBone, matrix, pos, rot, scl, parent, boneFrame, lastBoneFrame,
		i, il;
	    
	    time = this._time += dt;
	    alpha = time / this.rate;
	    
	    if( time > this.rate ){
		this._time = 0;
		
		lastFrame = frame;
		frame += ~~alpha * order;
		alpha = 0;
		
		if( order === 1 ){
		    if( frame > length ){
			if( mode === PINGPONG ){
			    this.order = -1;
			    frame = length;
			}
			else if( mode === LOOP ){
			    frame = 0;
			}
			else if( mode === ONCE ){
			    this.stop();
			    return;
			}
		    }
		}
		else{
		    if( frame < 1 ){
			if( mode === PINGPONG ){
			    this.order = 1;
			    frame = 0;
			}
			else if( mode === LOOP ){
			    frame = length;
			}
			else if( mode === ONCE ){
			    this.stop();
			    return;
			}
		    }
		}
	    }
	    
	    alpha = clamp01( alpha );
	    this.frame = frame;
	    this._lastFrame = lastFrame;
	    
	    frameState = animation[ frame ];
	    lastFrameState = animation[ lastFrame ] || frameState;
	    
	    for( i = 0, il = bones.length; i < il; i++ ){
		bone = bones[i];
		
		matrixBone = bone.matrixBone; matrix = bone.matrix; pos = bone.position; rot = bone.rotation; scl = bone.scale;
		
		boneFrame = frameState[i];
		lastBoneFrame = lastFrameState[i];
		
		LAST_POSITION.set( lastBoneFrame[0], lastBoneFrame[1], lastBoneFrame[2] );
		LAST_ROTATION.set( lastBoneFrame[3], lastBoneFrame[4], lastBoneFrame[5], lastBoneFrame[6] );
		LAST_SCALE.set( lastBoneFrame[7], lastBoneFrame[8], lastBoneFrame[9] );
		
		POSITION.set( boneFrame[0], boneFrame[1], boneFrame[2] );
		ROTATION.set( boneFrame[3], boneFrame[4], boneFrame[5], boneFrame[6] );
		SCALE.set( boneFrame[7], boneFrame[8], boneFrame[9] );
		
		pos.vlerp( LAST_POSITION, POSITION, alpha );
		rot.qnlerp( LAST_ROTATION, ROTATION, alpha );
		scl.vlerp( LAST_SCALE, SCALE, alpha );
		
		matrixBone.compose( pos, scl, rot );
		
		if( bone.skinned ){
		    if( bone.parentIndex !== -1 ){
			parent = bones[ bone.parentIndex ];
			
			MATRIX.mmul( parent.matrixBone, matrixBone );
			if( bone.inheritRotation ){
			    if( bone.inheritScale ){
				matrixBone.extractRotationScale( MATRIX );
			    }
			    else{
				matrixBone.extractRotation( MATRIX );
			    }
			}
			matrixBone.extractPosition( MATRIX );
		    }
		}
		
		matrixBone.mul( bone.bindPose );
		matrix.copy( matrixBone );
		
		parent = bone.parent;
		
		if( parent ){
		    bone.matrixWorld.mmul( parent.matrixWorld, matrix );
		}
		else{
		    bone.matrixWorld.copy( matrix );
		}
	    }
	};
	
	/**
	 * @method play
	 * @memberof Animation
	 * @brief plays animation with name and playback mode, rate, and order
	 * @param String name
	 * @param Number mode
	 * @param Number rate
	 * @param Number order
	 * @return this
	 */
	Animation.prototype.play = function( name, mode, rate, order ){
	    if( this.current === name ) return this;
	    
	    var meshfilter = this.meshfilter, mesh = meshfilter.mesh, animations = mesh.animations,
		animation = animations[ name ];
	    
	    if( !animation ){
		console.warn("Animation.play: no animation named "+ name +" found in mesh's animations");
		return this;
	    }
	    
	    this.current = name;
	    this.mode = mode;
	    this.rate = rate !== undefined ? rate : this.rate;
	    this.order = order !== undefined ? order : 1;
	    
	    if( this.order === 1 ){
		this.frame = this._lastFrame = 0;
	    }
	    else{
		this.frame = this._lastFrame = animation.length - 1;
	    }
	    
	    this.playing = true;
	    this.emit("play", name );
	    
	    return this;
	};
	
	/**
	 * @method stop
	 * @memberof Animation
	 * @brief stops animation
	 * @return this
	 */
	Animation.prototype.stop = function(){
	    
	    if( this.playing ) this.emit("stop");
	    this.playing = false;
	    
	    return this;
	};
	
	/**
	 * @method getBone
	 * @memberof Animation
	 * @brief returns bone by name
	 * @param String name
	 * @return Bone
	 */
	Animation.prototype.getBone = function( name ){
	    
	    return this._boneHash[ name ];
	};
	
	
	var ONCE = Animation.ONCE = 1,
	    LOOP = Animation.LOOP = 2,
	    PINGPONG = Animation.PINGPONG = 3;
	
	
	return Animation;
    }
);