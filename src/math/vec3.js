if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define(
    function(){
	"use strict";
	
	
	var sqrt = Math.sqrt;
	
	/**
	 * @class Vec3
	 * @brief 3d vector
	 * @param Number x
	 * @param Number y
	 * @param Number z
	 */
	function Vec3( x, y, z ){
	    
	    /**
	    * @property Number x
	    * @memberof Vec3
	    */
	    this.x = x || 0;
	    
	    /**
	    * @property Number y
	    * @memberof Vec3
	    */
	    this.y = y || 0;
	    
	    /**
	    * @property Number z
	    * @memberof Vec3
	    */
	    this.z = z || 0;
	}
	
	/**
	 * @method clone
	 * @memberof Vec3
	 * @brief returns new instance of this
	 * @return Vec3
	 */
	Vec3.prototype.clone = function(){
	    
	    return new Vec3( this.x, this.y, this.z );
	};
	
	/**
	 * @method copy
	 * @memberof Vec3
	 * @brief copies other
	 * @param Vec3 other
	 * @return this
	 */
	Vec3.prototype.copy = function( other ){
	    
	    this.x = other.x;
	    this.y = other.y;
	    this.z = other.z;
	    
	    return this;
	};
	
	/**
	 * @method set
	 * @memberof Vec3
	 * @brief sets values of this
	 * @param Number x
	 * @param Number y
	 * @param Number z
	 * @return this
	 */
	Vec3.prototype.set = function( x, y, z ){
	    
	    this.x = x;
	    this.y = y;
	    this.z = z;
	    
	    return this;
	};
	
	/**
	 * @method add
	 * @memberof Vec3
	 * @brief adds other's values to this 
	 * @param Vec3 other
	 * @return this
	 */
	Vec3.prototype.add = function( other ){
	    
	    this.x += other.x;
	    this.y += other.y;
	    this.z += other.z;
	    
	    return this;
	};
	
	/**
	 * @method vadd
	 * @memberof Vec3
	 * @brief adds a and b together saves it in this
	 * @param Vec3 a
	 * @param Vec3 b
	 * @return this
	 */
	Vec3.prototype.vadd = function( a, b ){
	    
	    this.x = a.x + b.x;
	    this.y = a.y + b.y;
	    this.z = a.z + b.z;
	    
	    return this;
	};
	
	/**
	 * @method sadd
	 * @memberof Vec3
	 * @brief adds scalar value to this
	 * @param Number s
	 * @return this
	 */
	Vec3.prototype.sadd = function( s ){
	    
	    this.x += s;
	    this.y += s;
	    this.z += s;
	    
	    return this;
	};
	
	/**
	 * @method sub
	 * @memberof Vec3
	 * @brief subtracts other's values from this
	 * @param Vec3 other
	 * @return this
	 */
	Vec3.prototype.sub = function( other ){
	    
	    this.x -= other.x;
	    this.y -= other.y;
	    this.z -= other.z;
	    
	    return this;
	};
	
	/**
	 * @method vsub
	 * @memberof Vec3
	 * @brief subtracts b from a saves it in this
	 * @param Vec3 a
	 * @param Vec3 b
	 * @return this
	 */
	Vec3.prototype.vsub = function( a, b ){
	    
	    this.x = a.x - b.x;
	    this.y = a.y - b.y;
	    this.z = a.z - b.z;
	    
	    return this;
	};
	
	/**
	 * @method ssub
	 * @memberof Vec3
	 * @brief subtracts this by a scalar value
	 * @param Number s
	 * @return this
	 */
	Vec3.prototype.ssub = function( s ){
	    
	    this.x -= s;
	    this.y -= s;
	    this.z -= s;
	    
	    return this;
	};
	
	/**
	 * @method mul
	 * @memberof Vec3
	 * @brief muliples this's values by other's 
	 * @param Vec3 other
	 * @return this
	 */
	Vec3.prototype.mul = function( other ){
	    
	    this.x *= other.x;
	    this.y *= other.y;
	    this.z *= other.z;
	    
	    return this;
	};
	
	/**
	 * @method vmul
	 * @memberof Vec3
	 * @brief muliples a and b saves it in this 
	 * @param Vec3 a
	 * @param Vec3 b
	 * @return this
	 */
	Vec3.prototype.vmul = function( a, b ){
	    
	    this.x = a.x * b.x;
	    this.y = a.y * b.y;
	    this.z = a.z * b.z;
	    
	    return this;
	};
	
	/**
	 * @method smul
	 * @memberof Vec3
	 * @brief muliples this by a scalar value
	 * @param Number s
	 * @return this
	 */
	Vec3.prototype.smul = function( s ){
	    
	    this.x *= s;
	    this.y *= s;
	    this.z *= s;
	    
	    return this;
	};
	
	/**
	 * @method div
	 * @memberof Vec3
	 * @brief divides this's values by other's 
	 * @param Vec3 other
	 * @return this
	 */
	Vec3.prototype.div = function( other ){
	    var x = other.x, y = other.y, z = other.z, w = other.w;
	    
	    this.x *= x !== 0 ? 1 / x : 0;
	    this.y *= y !== 0 ? 1 / y : 0;
	    this.z *= z !== 0 ? 1 / z : 0;
	    
	    return this;
	};
	
	/**
	 * @method vdiv
	 * @memberof Vec3
	 * @brief divides b from a saves it in this
	 * @param Vec3 a
	 * @param Vec3 b
	 * @return this
	 */
	Vec3.prototype.vdiv = function( a, b ){
	    var x = b.x, y = b.y, z = b.z;
	    
	    this.x = x !== 0 ? a.x / x : 0;
	    this.y = y !== 0 ? a.y / y : 0;
	    this.z = z !== 0 ? a.z / z : 0;
	    
	    return this;
	};
	
	/**
	 * @method sdiv
	 * @memberof Vec3
	 * @brief divides this by scalar value
	 * @param Number s
	 * @return this
	 */
	Vec3.prototype.sdiv = function( s ){
	    s = s === 0 ? 0 : 1 / s;
	    
	    this.x *= s;
	    this.y *= s;
	    this.z *= s;
	    
	    return this;
	};
        
        /**
	 * @method length
	 * @memberof Vec3
	 * @brief returns the length of this
	 * @return Number
	 */
        Vec3.prototype.length = function(){
            var x = this.x, y = this.y, z = this.z,
		lsq = x * x + y * y + z * z;
	    
	    if( lsq === 1 ) return 1;
	    
            return lsq === 0 ? 0 : sqrt( lsq );
        };
        
        /**
	 * @method lengthSq
	 * @memberof Vec3
	 * @brief returns the squared length of this
	 * @return Number
	 */
        Vec3.prototype.lengthSq = function(){
            var x = this.x, y = this.y, z = this.z;
	    
            return x * x + y * y + z * z;
        };
	
        /**
	 * @method setLength
	 * @memberof Vec3
	 * @brief sets this so its magnitude is equal to length
	 * @param Number length
	 * @return Vec3
	 */
        Vec3.prototype.setLength = function( length ){
            var x = this.x, y = this.y, z = this.z,
		l = x * x + y * y + z * z;
	    
	    if( l === 1 ){
		this.x *= length;
		this.y *= length;
		this.z *= length;
		
		return this;
	    }
	    
	    l = l > 0 ? 1 / sqrt( l ) : 0;
	    
	    this.x *= l * length;
	    this.y *= l * length;
	    this.z *= l * length;
            
            return this;
        };
        
        /**
	 * @method normalize
	 * @memberof Vec3
	 * @brief returns this with a length of 1
	 * @return this
	 */
        Vec3.prototype.normalize = function(){
            var x = this.x, y = this.y, z = this.z,
		l = x * x + y * y + z * z;
	    
	    if( l === 1 ) return this;
	    
	    l = l > 0 ? 1 / sqrt( l ) : 0;
	    
	    this.x *= l;
	    this.y *= l;
	    this.z *= l;
            
            return this;
        };
        
        /**
	 * @method inverse
	 * @memberof Vec3
	 * @brief returns the inverse of this
	 * @return this
	 */
        Vec3.prototype.inverse = function(){
	    
	    this.x *= -1;
	    this.y *= -1;
	    this.z *= -1;
	    
            return this;
        };
        
        /**
	 * @method inverseVec
	 * @memberof Vec3
	 * @brief returns the inverse of other
	 * @param Vec3 other
	 * @return this
	 */
        Vec3.prototype.inverseVec = function( other ){
	    
	    this.x = -other.x;
	    this.y = -other.y;
	    this.z = -other.z;
	    
            return this;
        };
        
        /**
	 * @method lerp
	 * @memberof Vec3
	 * @brief linear interpolation between this and other by x
	 * @param Vec3 other
	 * @param Number x
	 * @return Vec3
	 */
        Vec3.prototype.lerp = function( other, x ){
            
            this.x += ( other.x - this.x ) * x;
            this.y += ( other.y - this.y ) * x;
            this.z += ( other.z - this.z ) * x;
            
            return this;
        };
        
        /**
	 * @method vlerp
	 * @memberof Vec3
	 * @brief linear interpolation between a and b by x
	 * @param Vec3 a
	 * @param Vec3 b
	 * @param Number x
	 * @return Vec3
	 */
        Vec3.prototype.vlerp = function( a, b, x ){
            var ax = a.x, ay = a.y, az = a.z;
	    
            this.x = ax + ( b.x - ax ) * x;
            this.y = ay + ( b.y - ay ) * x;
            this.z = az + ( b.z - az ) * x;
            
            return this;
        };
        
        /**
	 * @method vdot
	 * @memberof Vec3
	 * @brief dot product of two vectors, can be called as a static function Vec3.vdot( a, b )
	 * @param Vec3 a
	 * @param Vec3 b
	 * @return Number
	 */
        Vec3.vdot = Vec3.prototype.vdot = function( a, b ){
            
            return a.x * b.x + a.y * b.y + a.z * b.z;
        };
        
        /**
	 * @method dot
	 * @memberof Vec3
	 * @brief dot product of this and other vector
	 * @param Vec3 other
	 * @return Number
	 */
        Vec3.prototype.dot = function( other ){
            
            return this.x * other.x + this.y * other.y + this.z * other.z;
        };
        
        /**
	 * @method vcross
	 * @memberof Vec3
	 * @brief cross product between a vector and b vector
	 * @param Vec3 a
	 * @param Vec3 b
	 * @return Number
	 */
        Vec3.prototype.vcross = function( a, b ){
	    var ax = a.x, ay = a.y, az = a.z,
                bx = b.x, by = b.y, bz = b.z;
            
            this.x = ay * bz - az * by;
            this.y = az * bx - ax * bz;
            this.z = ax * by - ay * bx;
            
            return this;
        };
        
        /**
	 * @method cross
	 * @memberof Vec3
	 * @brief cross product between this vector and other
	 * @param Vec3 other
	 * @return Number
	 */
        Vec3.prototype.cross = function( other ){
	    var ax = this.x, ay = this.y, az = this.z,
                bx = other.x, by = other.y, bz = other.z;
            
            this.x = ay * bz - az * by;
            this.y = az * bx - ax * bz;
            this.z = ax * by - ay * bx;
            
            return this;
        };
        
        /**
	 * @method distanceTo
	 * @memberof Vec3
	 * @brief distance to other
	 * @param Vec3 other
	 * @return Number
	 */
        Vec3.prototype.distanceTo = function( other ){
	    var x = this.x - other.x,
		y = this.y - other.y,
		z = this.z - other.z,
		l = x * x + y * y + z * z;
	    
	    return l === 0 ? 0 : sqrt( l );
        };
        
        /**
	 * @method distanceToSq
	 * @memberof Vec3
	 * @brief squared distance to other
	 * @param Vec3 other
	 * @return Number
	 */
        Vec3.prototype.distanceToSq = function( other ){
	    var x = this.x - other.x,
		y = this.y - other.y,
		z = this.z - other.z;
	    
	    return x * x + y * y + z * z;
        };
        
        /**
	 * @method min
	 * @memberof Vec3
	 * @brief returns min values from this and other vector
	 * @param Vec3 other
	 * @return this
	 */
        Vec3.prototype.min = function( other ){
            var ax = this.x, ay = this.y, az = this.z,
		bx = other.x, by = other.y, bz = other.z;
	    
	    this.x = bx < ax ? bx : ax;
	    this.y = by < ay ? by : ay;
	    this.z = bz < az ? bz : az;
            
            return this;
        };
        
        /**
	 * @method max
	 * @memberof Vec3
	 * @brief returns max values from this and other vector
	 * @param Vec3 other
	 * @return this
	 */
        Vec3.prototype.max = function( other ){
            var ax = this.x, ay = this.y, az = this.z,
		bx = other.x, by = other.y, bz = other.z;
	    
	    this.x = bx > ax ? bx : ax;
	    this.y = by > ay ? by : ay;
	    this.z = bz > az ? bz : az;
            
            return this;
        };
        
        /**
	 * @method clamp
	 * @memberof Vec3
	 * @brief clamp values between min and max's values
	 * @param Vec3 min
	 * @param Vec3 max
	 * @return this
	 */
        Vec3.prototype.clamp = function( min, max ){
            var x = this.x, y = this.y, z = this.z,
		minx = min.x, miny = min.y, minz = min.z, maxx = max.x, maxy = max.y, maxz = max.z;
	    
	    this.x = x < minx ? minx : x > maxx ? maxx : x;
	    this.y = y < miny ? miny : y > maxy ? maxy : y;
	    this.z = z < minz ? minz : z > maxz ? maxz : z;
            
            return this;
        };
        
        /**
	 * @method transformMat3
	 * @memberof Vec3
	 * @brief transforms this with Mat3
	 * @param Mat3 m
	 * @return this
	 */
        Vec3.prototype.transformMat3 = function( m ){
	    var me = m.elements,
		x = this.x, y = this.y, z = this.z;
            
            this.x = x * me[0] + y * me[3] + z * me[6];
            this.y = x * me[1] + y * me[4] + z * me[7];
            this.z = x * me[2] + y * me[5] + z * me[8];
            
            return this;
        };
        
        /**
	 * @method untransformMat3
	 * @memberof Vec3
	 * @brief untransforms this with Mat3
	 * @param Mat3 m
	 * @return this
	 */
        Vec3.prototype.untransformMat3 = function( m ){
	    var me = m.elements,
		x = this.x, y = this.y, z = this.z;
            
            this.x = x * me[0] + y * me[1] + z * me[2];
            this.y = x * me[3] + y * me[4] + z * me[5];
            this.z = x * me[6] + y * me[7] + z * me[8];
            
            return this;
        };
        
        /**
	 * @method transformMat4
	 * @memberof Vec3
	 * @brief transforms this with Mat4
	 * @param Mat4 m
	 * @return this
	 */
        Vec3.prototype.transformMat4 = function( m ){
	    var me = m.elements,
		x = this.x, y = this.y, z = this.z;
            
            this.x = x * me[0] + y * me[4] + z * me[8] + me[12];
            this.y = x * me[1] + y * me[5] + z * me[9] + me[13];
            this.z = x * me[2] + y * me[6] + z * me[10] + me[14];
            
            return this;
        };
        
        /**
	 * @method untransformMat4
	 * @memberof Vec3
	 * @brief untransforms this with Mat4
	 * @param Mat4 m
	 * @return this
	 */
        Vec3.prototype.untransformMat4 = function( m ){
	    var me = m.elements,
		x = this.x, y = this.y, z = this.z;
            
            this.x = x * me[0] + y * me[1] + z * me[2] + me[3];
            this.y = x * me[4] + y * me[5] + z * me[6] + me[7];
            this.z = x * me[8] + y * me[9] + z * me[10] + me[11];
            
            return this;
        };
        
        /**
	 * @method rotateMat4
	 * @memberof Vec3
	 * @brief transforms this with Mat4 rotation
	 * @param Mat4 m
	 * @return this
	 */
        Vec3.prototype.rotateMat4 = function( m ){
	    var me = m.elements,
		x = this.x, y = this.y, z = this.z;
            
            this.x = x * me[0] + y * me[4] + z * me[8];
            this.y = x * me[1] + y * me[5] + z * me[9];
            this.z = x * me[2] + y * me[6] + z * me[10];
            
            return this;
        };
        
        /**
	 * @method unrotateMat4
	 * @memberof Vec3
	 * @brief untransforms this with Mat4 rotation
	 * @param Mat4 m
	 * @return this
	 */
        Vec3.prototype.unrotateMat4 = function( m ){
	    var me = m.elements,
		x = this.x, y = this.y, z = this.z;
            
            this.x = x * me[0] + y * me[1] + z * me[2];
            this.y = x * me[4] + y * me[5] + z * me[6];
            this.z = x * me[8] + y * me[9] + z * me[10];
            
            return this;
        };
        
        /**
	 * @method transformQuat
	 * @memberof Vec3
	 * @brief transforms this with Quat
	 * @param Quat q
	 * @return this
	 */
        Vec3.prototype.transformQuat = function( q ){
	    var x = this.x, y = this.y, z = this.z,
		qx = q.x, qy = q.y, qz = q.z, qw = q.w,
		
		ix = qw * x + qy * z - qz * y,
		iy = qw * y + qz * x - qx * z,
		iz = qw * z + qx * y - qy * x,
		iw = -qx * x - qy * y - qz * z;
		
	    this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
	    this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
	    this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
            
            return this;
        };
        
        /**
	 * @method untransformQuat
	 * @memberof Vec3
	 * @brief untransforms this with Quat
	 * @param Quat q
	 * @return this
	 */
        Vec3.prototype.untransformQuat = function( q ){
	    var x = this.x, y = this.y, z = this.z,
		qx = q.x, qy = q.y, qz = q.z, qw = q.w,
		
		ix = qw * x + qy * z - qz * y,
		iy = qw * y + qz * x - qx * z,
		iz = qw * z + qx * y - qy * x,
		iw = -qx * x - qy * y - qz * z;
		
	    this.x = ix * -qw + iw * qx + iy * qz - iz * qy;
	    this.y = iy * -qw + iw * qy + iz * qx - ix * qz;
	    this.z = iz * -qw + iw * qz + ix * qy - iy * qx;
            
            return this;
        };
        
        /**
	 * @method fromVec2
	 * @memberof Vec3
	 * @brief sets values from Vec2
	 * @param Vec2 v
	 * @return this
	 */
        Vec3.prototype.fromVec2 = function( v ){
	    
	    this.x = v.x;
	    this.y = v.y;
	    this.z = 0;
	    
            return this;
        };
        
        /**
	 * @method fromVec4
	 * @memberof Vec3
	 * @brief sets values from Vec4
	 * @param Vec4 v
	 * @return this
	 */
        Vec3.prototype.fromVec4 = function( v ){
	    
	    this.x = v.x;
	    this.y = v.y;
	    this.z = v.z;
	    
            return this;
        };
        
        /**
	 * @method positionFromMat4
	 * @memberof Vec3
	 * @brief sets position from Mat4
	 * @param Mat4 m
	 * @return this
	 */
        Vec3.prototype.positionFromMat4 = function( m ){
	    var me = m.elements;
	    
	    this.x = me[12];
	    this.y = me[13];
	    this.z = me[14];
	    
            return this;
        };
        
        /**
	 * @method scaleFromMat3
	 * @memberof Vec3
	 * @brief sets this from Mat3 scale
	 * @param Mat3 m
	 * @return this
	 */
        Vec3.prototype.scaleFromMat3 = function( m ){
	    var me = m.elements,
		x = this.set( me[0], me[3], me[6] ).length(),
		y = this.set( me[1], me[4], me[7] ).length(),
		z = this.set( me[2], me[5], me[8] ).length();
	    
	    this.x = x;
	    this.y = y;
	    this.z = z;
	    
            return this;
        };
        
        /**
	 * @method scaleFromMat4
	 * @memberof Vec3
	 * @brief sets this from Mat4 scale
	 * @param Mat4 m
	 * @return this
	 */
        Vec3.prototype.scaleFromMat4 = function( m ){
	    var me = m.elements,
		x = this.set( me[0], me[4], me[8] ).length(),
		y = this.set( me[1], me[5], me[9] ).length(),
		z = this.set( me[2], me[6], me[10] ).length();
	    
	    this.x = x;
	    this.y = y;
	    this.z = z;
	    
            return this;
        };
        
        /**
	 * @method fromArray
	 * @memberof Vec3
	 * @brief sets values from array
	 * @param Array array
	 * @return this
	 */
        Vec3.prototype.fromArray = function( array ){
	    
	    this.x = array[0];
	    this.y = array[1];
	    this.z = array[2];
	    
            return this;
        };
        
        /**
	 * @method fromJSON
	 * @memberof Vec3
	 * @brief sets values from JSON object
	 * @param Object json
	 * @return this
	 */
        Vec3.prototype.fromJSON = function( json ){
	    
	    this.x = json.x;
	    this.y = json.y;
	    this.z = json.z;
	    
            return this;
        };
        
        /**
	 * @method toArray
	 * @memberof Vec3
	 * @brief returns array of this
	 * @return Object
	 */
        Vec3.prototype.toArray = function(){
	    
            return [ this.x, this.y, this.z ];
        };
        
        /**
	 * @method toJSON
	 * @memberof Vec3
	 * @brief returns json object of this
	 * @return Object
	 */
        Vec3.prototype.toJSON = function(){
	    
            return { x: this.x, y: this.y, z: this.z };
        };
        
        /**
	 * @method toString
	 * @memberof Vec3
	 * @brief returns string of this
	 * @return String
	 */
        Vec3.prototype.toString = function(){
            
            return "Vec3( "+ this.x +", "+ this.y +", "+ this.z +" )";
        };
        
        /**
	 * @method equals
	 * @memberof Vec3
	 * @brief checks if this's values equal other's values
	 * @param Vec3 other
	 * @return Boolean
	 */
        Vec3.prototype.equals = function( other ){
            
            return !( this.x !== other.x || this.y !== other.y || this.z !== other.z );
        };
        
        /**
	 * @method vequals
	 * @memberof Vec3
	 * @brief checks if a's values equal b's values, can be called as a static function Vec3.vequals( a, b )
	 * @param Vec3 a
	 * @param Vec3 b
	 * @return Boolean
	 */
        Vec3.vequals = Vec3.prototype.vequals = function( a, b ){
            
            return !( a.x !== b.x || a.y !== b.y || a.z !== b.z );
        };
	
	
	return Vec3;
    }
);