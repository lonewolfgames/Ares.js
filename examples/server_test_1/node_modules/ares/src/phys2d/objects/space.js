if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
define([
        "base/class",
		"math/vec2",
        "phys2d/enums",
        "phys2d/objects/particle",
		"phys2d/collision/broadphase",
		"phys2d/collision/nearphase"
    ],
    function(Class, Vec2, Enums, Particle, Broadphase, Nearphase) {
        "use strict";
		
        /**
		* @class Phys2D.Space
		* @extends Class
		* @brief base class for 2d physics bodies
		* @param Object options
		*/
        function Space(opts) {
            opts || (opts = Class.OBJECT);

            Class.call(this, opts);
			
			/**
            * @property Broadphase broadphase
            * @memberof Phys2D.Space
            */
			this.broadphase = new Broadphase(opts);
			
			/**
            * @property Nearphase nearphase
            * @memberof Phys2D.Space
            */
			this.nearphase = new Nearphase(opts);
			
            /**
            * @property Array bodies
            * @memberof Phys2D.Space
            */
            this.bodies = [];
            this._bodyHash = {};
			
			this._pairsi = [];
			this._pairsj = [];
			
			/**
            * @property Array contacts
            * @memberof Phys2D.Space
            */
			this.contacts = [];
			
            /**
            * @property Vec2 gravity
            * @memberof Phys2D.Space
            */
            this.gravity = opts.gravity || new Vec2(0, -9.801);
        }

        Class.extend(Space, Class);

        /**
        * @method addBody
        * @memberof Phys2D.Space
        * @param Phys2D.Particle
        * @return this
        */
        Space.prototype.addBody = function( body ) {
            if (!(body instanceof Particle)) {
                console.warn("Space.addBody: can\'t add passed argument, it is not instance of Particle");
                return this;
            }
			var bodies = this.bodies,
                index = bodies.indexOf(body);

            if (index === -1) {
                if (body.space) body.space.removeBody(body);

                body.space = this;
                bodies.push(body);
				this._bodyHash[ body._id ] = body;
				
				body.init();
				
                this.emit("addBody", body);
            } else {
                console.warn("Space.addBody: Body is already a member of this");
            }
			
			return this;
        };

        /**
        * @method removeBody
        * @memberof Phys2D.Space
        * @param Phys2D.Particle
        * @return this
        */
        Space.prototype.removeBody = function( body ) {
            if (!(body instanceof Particle)) {
                console.warn("Space.removeBody: can\'t remove passed argument, it is not instance of Particle");
                return this;
            }
			var bodies = this.bodies,
                index = bodies.indexOf(body);

            if (index !== -1) {

                body.space = undefined;
                bodies.splice(index, 1);
				this._bodyHash[ body._id ] = undefined;
				
                this.emit("removeBody", body);
            } else {
                console.warn("Space.removeBody: Body is not a member of this");
            }
			
			return this;
        };

        /**
        * @method update
        * @memberof Phys2D.Space
        * @return this
        */
        Space.prototype.update = function(dt) {
            var bodies = this.bodies,
				pairsi = this._pairsi,
				pairsj = this._pairsj,
				contacts = this.contacts,
				numBodies = bodies.length,
				gravity = this.gravity,
				gx = gravity.x,
				gy = gravity.y,
				body,
				force,
				mass,
				i;
			
			for (i = numBodies; i--;) {
				body = bodies[i];
				force = body.force;
				mass = body.mass;
				
				force.x = gx * mass;
				force.y = gy * mass;
			}
			
			this.broadphase.collisions(bodies, pairsi, pairsj);
			this.nearphase.collisions(pairsi, pairsj, contacts);
			
			for (i = numBodies; i--;) bodies[i].update(dt);
        };


        return Space;
    }
);
