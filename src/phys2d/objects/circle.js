if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
define([
        "base/class",
		"phys2d/enums",
        "phys2d/objects/shape"
    ],
    function(Class, Enums, Shape) {
        "use strict";

        
		var PI = Math.PI,
			SHAPE_CIRCLE = Enums.SHAPE_CIRCLE;
		
        /**
        * @class Phys2D.Circle
        * @extends Phys2D.Shape
        * @brief circle shape
        * @param Object options
        */
        function Circle(opts) {
            opts || (opts = Class.OBJECT);

            Shape.call(this, opts);
			
            this._type = SHAPE_CIRCLE;
			
			/**
			* @property Number radius
			* @memberof Phys2D.Circle
			*/
			this.radius = opts.radius !== undefined ? opts.radius : 0.5;
			
			/**
			* @property Number innerRadius
			* @memberof Phys2D.Circle
			*/
			this.innerRadius = opts.innerRadius !== undefined ? opts.innerRadius : 0;
        }

        Class.extend(Circle, Shape);

		
		Circle.prototype.copy = function( other ){
			
			this.density = other.density;
			
			this.localPosition.copy( other.localPosition );
			this.localRotation = other.localRotation;
			
			this.friction = other.friction;
			this.elasticity = other.elasticity;
			
			this.radius = other.radius;
			this.innerRadius = other.innerRadius;
			
			return this;
		};
		
		
		Circle.prototype.pointQuery = function( p ){
			var x = this.position,
				dx = x.x - p.x,
				dy = x.y - p.y,
				d = dx  * dx + dy  * dy,
				r = this.radius,
				ir = this.innerRadius;
			
			if( d > r  * r ) return false;
			
			return d > ir  * ir;
		};
		
		
		Circle.prototype.centroid = function( v ){
			var localPos = this.localPosition;
			
			v.x = localPos.x;
			v.y = localPos.y;
			
			return v;
		};
		
		
		Circle.prototype.area = function(){
			var r = this.radius,
				ir = this.innerRadius;
			
			return PI  * (r  * r - ir  * ir);
		};
		
		
		Circle.prototype.inertia = function( mass ){
			var r = this.radius,
				ir = this.innerRadius,
				localPos = this.localPosition,
				x = localPos.x,
				y = localPos.y;
			
			return mass  * ((( r  * r + ir  * ir )  * 0.5) + (x  * x + y  * y));
		};
		
		
		Circle.prototype.update = function( matrix ){
			var localMatrix = this.matrix,
				matrixWorld = this.matrixWorld,
				localPos = this.localPosition,
				pos = this.position,
				r = this.radius,
				aabb = this.aabb,
				min = aabb.min,
				max = aabb.max,
				x,
				y;
			
			matrixWorld.mmul( matrix, localMatrix );
			
			pos.x = localPos.x;
			pos.y = localPos.y;
			pos.transformMat32( matrix );
			x = pos.x; y = pos.y;
			
			min.x = x - r;
			min.y = y - r;
			max.x = x + r;
			max.y = y + r;
		};


        return Circle;
    }
);
