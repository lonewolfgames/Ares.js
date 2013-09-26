if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"math/vec2"
    ],
    function( Vec2 ){
	"use strict";
	
	
	var sqrt = Math.sqrt;
	
	/**
	 * @class Ray2
	 * @brief 2d ray
	 * @param Vec2 origin
	 * @param Vec2 direction
	 */
	function Ray2( origin, direction ){
	    
	    /**
	    * @property Vec2 origin
	    * @memberof Ray2
	    */
	    this.origin = origin || new Vec2;
	    
	    /**
	    * @property Vec2 direction
	    * @memberof Ray2
	    */
	    this.direction = direction || new Vec2;
	}
	
	/**
	 * @method clone
	 * @memberof Ray2
	 * @brief returns new instance of this
	 * @return Ray2
	 */
	Ray2.prototype.clone = function(){
	    
	    return new Ray2( this.origin.clone(), this.direction.clone() );
	};
	
	/**
	 * @method copy
	 * @memberof Ray2
	 * @brief copies other
	 * @param Ray2 other
	 * @return this
	 */
	Ray2.prototype.copy = function( other ){
	    
	    this.origin.copy( other.origin );
	    this.direction.copy( other.direction );
	    
	    return this;
	};
	
	/**
	 * @method set
	 * @memberof Ray2
	 * @brief sets values of this
	 * @param Vec2 origin
	 * @param Vec2 direction
	 * @return this
	 */
	Ray2.prototype.set = function( origin, direction ){
	    
	    this.origin.copy( other.origin );
	    this.direction.copy( other.direction );
	    
	    return this;
	};
	
	/**
	 * @method at
	 * @memberof Ray2
	 * @brief gets point at distance
	 * @param Number distance
	 * @param Vec2 out
	 * @return Vec2
	 */
	Ray2.prototype.at = function( distance, out ){
	    out || ( out = new Vec2 );
	    
	    return out.copy( this.direction ).smul( distance ).add( this.origin );
	};
	
	/**
	 * @method recast
	 * @memberof Ray2
	 * @brief recast this ray at a given distance
	 * @param Number distance
	 * @return this
	 */
	Ray2.prototype.recast = function(){
	    var vec = new Vec2;
	    
	    return function( distance ){
		
		this.origin.copy( this.at( distance, vec ) );
		
		return this;
	    };
	}();
	
	/**
	 * @method closestPointToPoint
	 * @memberof Ray2
	 * @brief returns the closest point to a given point
	 * @param Vec2 point
	 * @param Vec2 out
	 * @return Vec2
	 */
	Ray2.prototype.closestPointToPoint = function( point, out ){
	    out || ( out = new Vec2 );
	    
	    var origin = this.origin,
		direction = this.direction,
		distance = 0;
	    
	    out.vsub( point, origin );
	    distance = out.dot( direction );
	    
	    if( distance < 0 ) return out.copy( origin );
	    
	    return out.copy( direction ).smul( distance ).add( origin );
	};
	
	/**
	 * @method distanceToPoint
	 * @memberof Ray2
	 * @brief returns the distance to a given point
	 * @param Vec2 point
	 * @param Vec2 out
	 * @return Number
	 */
	Ray2.prototype.distanceToPoint = function(){
	    var vec = new Vec2;
	    
	    return function( point ){
		var origin = this.origin,
		    direction = this.direction,
		    distance = vec.vsub( point, origin ).dot( direction );
		
		if( distance < 0 ) return origin.distanceTo( point );
		
		vec.copy( direction ).smul( distance ).add( origin );
		
		return vec.distanceTo( point );
	    };
	}();
	
	/**
	 * @method distanceToPointSq
	 * @memberof Ray2
	 * @brief returns the squared distance to a given point
	 * @param Vec2 point
	 * @return Number
	 */
	Ray2.prototype.distanceToPointSq = function(){
	    var vec = new Vec2;
	    
	    return function( point ){
		var origin = this.origin,
		    direction = this.direction,
		    distance = vec.vsub( point, origin ).dot( direction );
		
		if( distance < 0 ) return origin.distanceToSq( point );
		
		vec.copy( direction ).smul( distance ).add( origin );
		
		return vec.distanceToSq( point );
	    };
	}();
	
	/**
	 * @method queryCircle
	 * @memberof Ray2
	 * @brief checks if this intersects with a circle's position and radius
	 * @param Vec2 position
	 * @param Number radius
	 * @return Boolean
	 */
	Ray2.prototype.queryCircle = function( position, radius ){
	    
	    return this.distanceToPointSq( position ) <= radius * radius;
	};
	
	/**
	 * @method intersectCircle
	 * @memberof Ray2
	 * @brief returns intersection point with a circle's position and radius, undefined if not intersecting
	 * @param Vec2 position
	 * @param Number radius
	 * @param Vec2 out
	 * @return Vec2
	 */
	Ray2.prototype.intersectCircle = function(){
	    var vec = new Vec2;
	    
	    return function( position, radius, out ){
		out || ( out = new Vec2 );
		vec.vsub( this.origin, position );
		
		var direction = this.direction,
		    a = direction.dot( direction ),
		    b = 2 * direction.dot( vec ),
		    c = vec.dot( vec ) - ( radius * radius ),
		    
		    d = b * b - 4 * a * c,
		    q, t0, t1, tmp;
		
		if( d < 0 ) return undefined;
		
		d = sqrt( d );
		if( b < 0 ){
		    q = ( -b - d ) * 0.5;
		}
		else{
		    q = ( -b + d ) * 0.5;
		}
		
		t0 = q / a;
		t1 = c / q;
		
		if( t0 > t1 ){
		    tmp = t0; t0 = t1; t1 = tmp;
		}
		
		if( t1 < 0 ) return undefined;
		
		if( t0 < 0 ){
		    return this.at( t1, out );
		}
		
		return this.at( t0, out );
	    };
	}();
        
        /**
	 * @method transformMat2
	 * @memberof Ray2
	 * @brief transforms this with Mat2
	 * @param Mat2 m
	 * @return this
	 */
        Ray2.prototype.transformMat2 = function( m ){
	    
	    this.origin.transformMat2( m );
	    this.direction.transformMat2( m ).normalize();
	    
            return this;
        };
        
        /**
	 * @method untransformMat2
	 * @memberof Ray2
	 * @brief untransforms this with Mat2
	 * @param Mat2 m
	 * @return this
	 */
        Ray2.prototype.untransformMat2 = function( m ){
	    
	    this.origin.untransformMat2( m );
	    this.direction.untransformMat2( m ).normalize();
	    
            return this;
        };
        
        /**
	 * @method transformMat32
	 * @memberof Ray2
	 * @brief transforms this with Mat32
	 * @param Mat32 m
	 * @return this
	 */
        Ray2.prototype.transformMat32 = function( m ){
	    
	    this.origin.transformMat32( m );
	    this.direction.rotateMat32( m ).normalize();
	    
            return this;
        };
        
        /**
	 * @method untransformMat32
	 * @memberof Ray2
	 * @brief untransforms this with Mat32
	 * @param Mat32 m
	 * @return this
	 */
        Ray2.prototype.untransformMat32 = function( m ){
	    
	    this.origin.untransformMat32( m );
	    this.direction.unrotateMat32( m ).normalize();
	    
            return this;
        };
        
        /**
	 * @method transformMat3
	 * @memberof Ray2
	 * @brief transforms this with Mat3
	 * @param Mat3 m
	 * @return this
	 */
        Ray2.prototype.transformMat3 = function( m ){
	    
	    this.origin.transformMat3( m );
	    this.direction.transformMat3( m ).normalize();
            
            return this;
        };
        
        /**
	 * @method untransformMat3
	 * @memberof Ray2
	 * @brief untransforms this with Mat3
	 * @param Mat3 m
	 * @return this
	 */
        Ray2.prototype.untransformMat3 = function( m ){
	    
	    this.origin.untransformMat3( m );
	    this.direction.untransformMat3( m ).normalize();
            
            return this;
        };
        
        /**
	 * @method transformMat4
	 * @memberof Ray2
	 * @brief transforms this with Mat4
	 * @param Mat4 m
	 * @return this
	 */
        Ray2.prototype.transformMat4 = function( m ){
	    
	    this.origin.transformMat4( m );
	    this.direction.rotateMat4( m ).normalize();
            
            return this;
        };
        
        /**
	 * @method untransformMat4
	 * @memberof Ray2
	 * @brief untransforms this with Mat4
	 * @param Mat4 m
	 * @return this
	 */
        Ray2.prototype.untransformMat4 = function( m ){
	    
	    this.origin.untransformMat4( m );
	    this.direction.unrotateMat4( m ).normalize();
            
            return this;
        };
        
        /**
	 * @method positionFromMat32
	 * @memberof Ray2
	 * @brief sets position from Mat32
	 * @param Mat32 m
	 * @return this
	 */
        Ray2.prototype.positionFromMat32 = function( m ){
	    
	    this.origin.positionFromMat32( m );
	    
            return this;
        };
        
        /**
	 * @method positionFromMat4
	 * @memberof Ray2
	 * @brief sets position from Mat4
	 * @param Mat4 m
	 * @return this
	 */
        Ray2.prototype.positionFromMat4 = function( m ){
	    
	    this.origin.positionFromMat4( m );
	    
            return this;
        };
        
        /**
	 * @method fromJSON
	 * @memberof Ray2
	 * @brief sets values from JSON object
	 * @param Object json
	 * @return this
	 */
        Ray2.prototype.fromJSON = function( json ){
	    
	    this.origin.fromJSON( json.origin );
	    this.direction.fromJSON( json.direction );
	    
            return this;
        };
        
        /**
	 * @method toJSON
	 * @memberof Ray2
	 * @brief returns json object of this
	 * @return Object
	 */
        Ray2.prototype.toJSON = function(){
	    
            return { origin: this.origin.toJSON(), direction: this.direction.toJSON() };
        };
        
        /**
	 * @method toString
	 * @memberof Ray2
	 * @brief returns string of this
	 * @return String
	 */
        Ray2.prototype.toString = function(){
            
            return "Ray2( origin: "+ this.origin +", direction: "+ this.direction +" )";
        };
        
        /**
	 * @method equals
	 * @memberof Ray2
	 * @brief checks if this's values equal other's values
	 * @param Ray2 other
	 * @return Boolean
	 */
        Ray2.prototype.equals = function( other ){
            
            return !( !this.origin.equals( other.origin ) || !this.direction.equals( other.direction ) );
        };
        
        /**
	 * @method requals
	 * @memberof Ray2
	 * @brief checks if a's values equal b's values, can be called as a static function Ray2.requals( a, b )
	 * @param Ray2 a
	 * @param Ray2 b
	 * @return Boolean
	 */
        Ray2.requals = Ray2.prototype.requals = function( a, b ){
            
            return !( !a.origin.equals( b.origin ) || !a.direction.equals( b.direction ) );
        };
	
	
	return Ray2;
    }
);