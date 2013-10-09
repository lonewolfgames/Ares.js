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

        
        var PARTICLE = Enums.PARTICLE,
        
            STATIC = Enums.STATIC,
            DYNAMIC = Enums.DYNAMIC,
            
            AWAKE = Enums.AWAKE,
            SLEEPING = Enums.SLEEPING,
            
            pow = Math.pow;
        
        /**
        * @class Phys2D.Particle
        * @extends Class
        * @brief base class for 2d physics bodies
        * @param Object options
        */
        function Particle(opts) {
            opts || (opts = Class.OBJECT);

            Class.call(this);
            
            this._type = PARTICLE;

            /**
            * @property Phys2D.Space space
            * @memberof Phys2D.Body
            */
            this.space = undefined;

            /**
            * @property Vec2 position
            * @memberof Phys2D.Particle
            */
            this.position = opts.position || new Vec2;

            /**
            * @property Vec2 velocity
            * @memberof Phys2D.Particle
            */
            this.velocity = opts.velocity || new Vec2;

            /**
            * @property Vec2 force
            * @memberof Phys2D.Particle
            */
            this.force = new Vec2;

			/**
			* @property Number linearDamping
			* @memberof Phys2D.Particle
			*/
			this.linearDamping = opts.linearDamping || 0;

            /**
            * @property Number mass
            * @memberof Phys2D.Particle
            */
            this.mass = opts.mass !== undefined ? opts.mass : 0;
            this.invMass = this.mass === 0 ? 0 : 1 / this.mass;

            /**
            * @property Number motionType
            * @memberof Phys2D.Particle
            */
            this.motionType = opts.motionType !== undefined ? opts.motionType : ( this.mass > 0 ? DYNAMIC : STATIC );

            /**
            * @property Number sleepState
            * @memberof Phys2D.Particle
            */
            this.sleepState = AWAKE;
        }

        Class.extend(Particle, Class);

        /**
        * @method update
        * @memberof Particle
        * @brief updates Particle
        * @return this
        */
        Particle.prototype.update = function(dt) {
            if (this.motionType === STATIC) return;

            var position = this.position,
                velocity = this.velocity,
                force = this.force,
                invMass = this.invMass,
				linearDamping = pow( 1 - this.linearDamping, dt );

            velocity.x += force.x  * invMass  * dt;
            velocity.y += force.y  * invMass  * dt;

			force.x = force.y = 0;
			
			velocity.x *= linearDamping;
			velocity.y *= linearDamping;
			
            if (this.sleepState !== SLEEPING) {
                position.x += velocity.x  * dt;
                position.y += velocity.y  * dt;
            }
        };
	
        /**
        * @method setMass
        * @memberof Phys2D.Particle
        * @param Number mass
        */
        Particle.prototype.setMass = function(mass){
            
            this.mass = mass;
            this.invMass = mass > 0 ? 1 / mass : 0;
        };
	
		/**
		* @method setMotionType
		* @memberof Phys2D.Particle
		* @param Number motionType
		*/
		Particle.prototype.setMotionType = function(motionType){
			if( this.motionType === motionType ) return;
			
			this.motionType = motionType;
			
			this.velocity.set(0, 0);
			this.force.set(0, 0);
			
			this.wake();
		};
        
        /**
        * @method isAwake
        * @memberof Phys2D.Particle
        */
        Particle.prototype.isAwake = function(){
            
            return this.sleepState === AWAKE;
        };
        
        /**
        * @method isSleeping
        * @memberof Phys2D.Particle
        */
        Particle.prototype.isSleeping = function(){
            
            return this.sleepState === SLEEPING;
        };
        
        /**
        * @method isDynamic
        * @memberof Phys2D.Particle
        */
        Particle.prototype.isDynamic = function(){
            
            return this.motionType === DYNAMIC;
        };
        
        /**
        * @method isStatic
        * @memberof Phys2D.Particle
        */
        Particle.prototype.isStatic = function(){
            
            return this.motionType === STATIC;
        };
        
        /**
        * @method isKinematic
        * @memberof Phys2D.Particle
        */
        Particle.prototype.isKinematic = function(){
            
            return this.motionType === KINEMATIC;
        };
        
        /**
        * @method wake
        * @memberof Phys2D.Particle
        */
        Particle.prototype.wake = function(){
            
            if( this.sleepState !== AWAKE ) this.emit("wake");
            this.sleepState = AWAKE;
        };
        
        /**
        * @method sleep
        * @memberof Phys2D.Particle
        */
        Particle.prototype.sleep = function(){
            
            if( this.sleepState === AWAKW ) this.emit("sleep");
            this.sleepState = SLEEPING;
        };


        return Particle;
    }
);
