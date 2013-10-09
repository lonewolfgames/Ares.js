if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
define([
        "base/class",
        "math/vec2",
		"phys2d/enums"
    ],
    function(Class, Vec2, Enums) {
        "use strict";

        
		var SHAPE_NONE = Enums.SHAPE_NONE;
		
        /**
        * @class Phys2D.Shape
        * @extends Class
        * @brief base class for 2d physics shapes
        * @param Object options
        */
        function Shape(opts) {
            opts || (opts = Class.OBJECT);

            Class.call(this);
			
            this._type = SHAPE_NONE;
			
			/**
			* @property Phys2D.Rigidbody body
			* @memberof Phys2D.Shape
			*/
			this.body = undefined;
			
			/**
			* @property Number density
			* @memberof Phys2D.Shape
			*/
			this.density = opts.density !== undefined ? opts.density : 1;
			
			/**
			* @property Vec2 localPosition
			* @memberof Phys2D.Shape
			*/
			this.localPosition = opts.localPosition || new Vec2;
			
			/**
			* @property Number localRotation
			* @memberof Phys2D.Shape
			*/
			this.localRotation = opts.localRotation !== undefined ? opts.localRotation : 0;
			
			/**
			* @property Vec2 position
			* @memberof Phys2D.Shape
			*/
			this.position = new Vec2;
			
			/**
			* @property Number rotation
			* @memberof Phys2D.Shape
			*/
			this.rotation = 0;
			
			/**
			* @property Mat32 matrix
			* @memberof Phys2D.Shape
			*/
			this.matrix = new Mat32;
			
			/**
			* @property Mat32 matrixWorld
			* @memberof Phys2D.Shape
			*/
			this.matrixWorld = new Mat32;
			
			/**
			* @property Number friction
			* @memberof Phys2D.Shape
			*/
			this.friction = opts.friction !== undefined ? opts.friction : 0.25;
			
			/**
			* @property Number elasticity
			* @memberof Phys2D.Shape
			*/
			this.elasticity = opts.elasticity !== undefined ? opts.elasticity : 0.25;
			
			/**
			* @property AABB2 aabb
			* @memberof Phys2D.Shape
			*/
			this.aabb = new AABB2;
        }

        Class.extend(Shape, Class);

		
		Shape.prototype.copy = function( other ){
			
			this.density = other.density;
			
			this.localPosition.copy( other.localPosition );
			this.localRotation = other.localRotation;
			
			this.friction = other.friction;
			this.elasticity = other.elasticity;
			
			return this;
		};
		
		/**
		* @method setLocalPosition
		* @memberof Phys2D.Shape
		* @param Vec2 v
		*/
		Shape.prototype.setLocalPosition = function( v ){
			
			this.localPosition.copy( v );
			this.matrix.setPosition( v );
		};
		
		/**
		* @method setLocalRotation
		* @memberof Phys2D.Shape
		* @param Number a
		*/
		Shape.prototype.setLocalRotation = function( a ){
			
			this.localRotation = a;
			this.matrix.setRotation( a );
		};
		
		/**
		* @method pointQuery
		* @memberof Phys2D.Shape
		* @param Vec2 point
		* @returns Boolean
		*/
		Shape.prototype.pointQuery = function( p ){
			
			return false;
		};
		
		/**
		* @method centroid
		* @memberof Phys2D.Shape
		* @param Vec2 v
		* @returns Vec2
		*/
		Shape.prototype.centroid = function( v ){
			
			return v.set(0, 0);
		};
		
		/**
		* @method area
		* @memberof Phys2D.Shape
		* @returns Number
		*/
		Shape.prototype.area = function(){
			
			return 0;
		};
		
		/**
		* @method inertia
		* @memberof Phys2D.Shape
		* @param Number mass
		* @returns Number
		*/
		Shape.prototype.inertia = function( mass ){
			
			return 0;
		};
		
		/**
		* @method update
		* @memberof Phys2D.Shape
		* @param Mat32 matrix
		*/
		Shape.prototype.update = function( matrix ){
			
		};


        return Shape;
    }
);
