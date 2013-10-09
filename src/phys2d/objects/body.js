if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
define([
        "base/class",
		"math/vec2",
		"math/aabb2",
        "phys2d/enums",
        "phys2d/objects/particle",
        "phys2d/objects/shape"
    ],
    function(Class, Vec2, AABB2, Enums, Particle, Shape) {
        "use strict";

		
        var STATIC = Enums.STATIC,
            DYNAMIC = Enums.DYNAMIC,
			
            BODY = Enums.BODY,

            AWAKE = Enums.AWAKE,
            SLEEPING = Enums.SLEEPING,
			
			pow = Math.pow,
			VEC2_ONE = new Vec2(1, 1);
		
        /**
        * @class Phys2D.Body
        * @extends Phys2D.Particle
        * @brief base class for 2d physics bodies
        * @param Object options
        */
        function Body(opts) {
            opts || (opts = Class.OBJECT);

            Particle.call(this, opts);
            
            this._type = BODY;

            /**
            * @property Number rotation
            * @memberof Phys2D.Body
            */
            this.rotation = opts.rotation !== undefined ? opts.rotation : 0;

            /**
            * @property Number angularVelocity
            * @memberof Phys2D.Body
            */
            this.angularVelocity = opts.angularVelocity !== undefined ? opts.angularVelocity : 0;

            /**
            * @property Number torque
            * @memberof Phys2D.Body
            */
            this.torque = 0;
            
            /**
           * @property Mat32 matrix
           * @memberof Phys2D.Body
           */
            this.matrix = new Mat32;

			/**
			* @property Number angularDamping
			* @memberof Phys2D.Body
			*/
			this.angularDamping = opts.angularDamping || 0;

            /**
            * @property Number mass
            * @memberof Phys2D.Body
            */
            this.inertia = opts.inertia !== undefined ? opts.inertia : 0;
            this.invInertia = this.inertia === 0 ? 0 : 1 / this.inertia;
			
			/**
            * @property Array shapes
            * @memberof Phys2D.Body
            */
			this.shapes = [];
			this._shapeHash = {};
			
			/**
			* @property AABB2 aabb
			* @memberof Phys2D.Body
			*/
			this.aabb = new AABB2;
			
			if (opts.shape) this.addShape(opts.shape);
			
			if (opts.shapes) {
				var shapes = opts.shapes,
					i;
			
				for (i = shapes.length; i--;)  this.addShape(shapes[i]);
			}
        }

        Class.extend(Body, Particle);
	
		/**
		* @method init
		* @memberof Phys2D.Body
		*/
		Body.prototype.init = function(){
			var shapes = this.shapes,
				aabb = this.aabb,
				matrix = this.matrix,
				shape,
				i;
			
			matrix.compose( this.position, VEC2_ONE, this.rotation );
			
			for (i = shapes.length; i--;) {
				shape = shapes[i];
				
				shape.update(matrix);
				aabb.union(shape.aabb);
			}
			
			this.resetMassData();
		};

        /**
        * @method update
        * @memberof Phys2D.Body
        * @brief updates Body
        * @return this
        */
        Body.prototype.update = function(dt) {
            if (this.motionType === STATIC) return;

            var position = this.position,
                velocity = this.velocity,
                force = this.force,
				rotation = this.rotation,
                invMass = this.invMass,
				linearDamping = pow( 1 - this.linearDamping, dt ),
				matrix = this.matrix,
				shapes = this.shapes,
				aabb = this.aabb,
				shape,
				i;

            velocity.x += force.x  * invMass  * dt;
            velocity.y += force.y  * invMass  * dt;
			
			this.angularVelocity += this.torque  * this.invInertia  * dt;

			force.x = force.y = this.torque = 0;
			
			velocity.x *= linearDamping;
			velocity.y *= linearDamping;
			
			this.angularVelocity *= pow( 1 - this.angularDamping, dt );
			
            if (this.sleepState !== SLEEPING) {
                position.x += velocity.x  * dt;
                position.y += velocity.y  * dt;
				
				this.rotation += this.angularVelocity  * dt;
				
				matrix.compose( position, VEC2_ONE, this.rotation );
				
				for (i = shapes.length; i--;) {
					shape = shapes[i];
					shape.update(matrix);
					aabb.union( shape.aabb );
				}
            }
        };
	
        /**
        * @method addShape
        * @memberof Phys2D.Body
        * @param Phys2D.Shape shape
        * @return this
        */
        Body.prototype.addShape = function(shape){
            if (!(shape instanceof Shape)) {
                console.warn("Body.addShape: can\'t add passed argument, it is not instance of Shape");
                return this;
            }
			var shapes = this.shapes,
                index = shapes.indexOf(shape);

            if (index === -1) {
                if (shape.body) shape = shape.clone();

                shape.body = this;
                shapes.push(shape);
				this._shapeHash[ shape._id ] = shape;
				
                this.emit("addShape", shape);
				
				if (this.space) this.resetMassData();
            } else {
                console.warn("Body.addShape: Shape is already a member of this");
            }
			
			return this;
        };
	
        /**
        * @method removeShape
        * @memberof Phys2D.Body
        * @param Phys2D.Shape shape
        * @return this
        */
        Body.prototype.removeShape = function(shape){
            if (!(shape instanceof Shape)) {
                console.warn("Body.removeShape: can\'t remove passed argument, it is not instance of Shape");
                return this;
            }
			var shapes = this.shapes,
                index = shapes.indexOf(shape);

            if (index !== -1) {

                shape.body = undefined;
                shapes.splice(index, 1);
				this._shapeHash[ shape._id ] = undefined;
				
                this.emit("removeShape", shape);
				
				if (this.space) this.resetMassData();
            } else {
                console.warn("Body.removeShape: Shape is not a member of this");
            }
			
			return this;
        };
	
        /**
        * @method setInertia
        * @memberof Phys2D.Body
        * @param Number inertia
        */
        Body.prototype.setInertia = function(inertia){
            
            this.inertia = inertia;
            this.invInertia = inertia > 0 ? 1 / inertia : 0;
        };
	
        /**
		* @method applyForce
		* @memberof Phys2D.Body
		* @param Vec2 force
		* @param Vec2 worldPoint
		*/
        Body.prototype.applyForce = function(force, worldPoint){
			if( this.motionType === STATIC ) return;
			var pos = this.position,
				f = this.force,
				fx = force.x,
				fy = force.y,
				px,
				py;
			
			worldPoint = worldPoint || pos;
			
			if (this.sleepState === AWAKE) this.wake();
			
			px = worldPoint.x - pos.x;
			py = worldPoint.y - pos.y;
			
			f.x += fx;
			f.y += fy;
			
			this.torque += px  * fy - py  * fx;
		};
	
        /**
		* @method applyTorque
		* @memberof Phys2D.Body
		* @param Number torque
		*/
        Body.prototype.applyTorque = function(torque){
			if (this.motionType === STATIC) return;
			if (this.sleepState === AWAKE) this.wake();
			
			this.torque += torque;
		};
	
        /**
		* @method applyImpulse
		* @memberof Phys2D.Body
		* @param Vec2 impulse
		* @param Vec2 worldPoint
		*/
        Body.prototype.applyTorque = function(torque){
			if( this.motionType === STATIC ) return;
			var pos = this.position,
				invMass = this.invMass,
				vel = this.velocity,
				ix = impulse.x,
				iy = impulse.y,
				px,
				py;
			
			worldPoint = worldPoint || pos;
			
			if( this.sleepState !== AWAKE ) this.wake();
			
			px = worldPoint.x - pos.x;
			py = worldPoint.y - pos.y;
			
			vel.x += ix  * invMass;
			vel.y += iy  * invMass;
			
			this.angularVelocity += (px  * iy - py  * ix)  * this.invInertia;
		};
	
        /**
		* @method resetMassData
		* @memberof Phys2D.Body
		*/
        Body.prototype.resetMassData = function(){
			var centroid = new Vec2;
	    
			return function(){
				if (this.motionType !== DYNAMIC) return;
				var shapes = this.shapes,
					totalMass = 0,
					totalInertia = 0,
					mass = 0,
					invMass = 0,
					tcx = 0,
					tcy = 0,
					cx = 0,
					cy = 0,
					shape,
					i;
				
				for (i = shapes.length; i--;) {
					shape = shapes[i];
					
					shape.centroid(centroid);
					
					mass = shape.area() * shape.density;
					
					tcx += centroid.x  * mass;
					tcy += centroid.y  * mass;
					
					totalMass += mass;
					totalInertia += shape.inertia( mass );
				}
				invMass = totalMass > 0 ? 1 / totalMass : 0;
				cx = tcx  * invMass;
				cy = tcy  * invMass;
				
				this.setMass(totalMass);
				this.setInertia(totalInertia - totalMass  * (cx  * cx + cy  * cy));
			};
		}();
	
		/**
		* @method setMotionType
		* @memberof Phys2D.Body
		* @param Number motionType
		*/
		Body.prototype.setMotionType = function(motionType){
			if( this.motionType === motionType ) return;
			
			this.motionType = motionType;
			
			this.velocity.set(0, 0);
			this.force.set(0, 0);
			this.angularVelocity = this.torque = 0;
			
			this.wake();
		};


        return Body;
    }
);
