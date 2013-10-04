if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
define([
        "base/class",
        "math/vec2"
    ],
    function(Class, Vec2) {
        "use strict";


        /**
         * @class Phys2D.Particle
         * @extends Class
         * @brief base class for 2d physics bodies
         * @param Object options
         */

        function Particle(opts) {
            opts || (opts = Class.OBJECT);

            Class.call(this);

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
             * @property Number mass
             * @memberof Phys2D.Particle
             */
            this.mass = opts.mass !== undefined ? opts.mass : 0;
            this.invMass = this.mass === 0 ? 0 : 1 / this.mass;

            /**
             * @property Number motionType
             * @memberof Phys2D.Particle
             */
            this.motionType = opts.motionType !== undefined ? opts.motionType : DYNAMIC;

            /**
             * @property Number sleepState
             * @memberof Phys2D.Particle
             */
            this.sleepState = opts.sleepState !== undefined ? opts.sleepState : AWAKE;
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
                mass = this.mass;

            velocity.x += force.x * mass;
            velocity.y += force.y * mass;

            if (this.sleepState !== SLEEPING) {
                position.x += velocity.x * dt;
                position.y += velocity.y * dt;
            }
        };


        var STATIC = Particle.STATIC = 1,
            KINEMATIC = Particle.KINEMATIC = 2
            DYNAMIC = Particle.DYNAMIC = 3,

            AWAKE = Particle.AWAKE = 1,
            SLEEPY = Particle.SLEEPY = 2
            SLEEPING = Particle.SLEEPING = 3;


        return Particle;
    }
);
