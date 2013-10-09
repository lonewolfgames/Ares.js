if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
define([
        "base/class",
        "phys2d/enums",
        "phys2d/objects/particle"
    ],
    function(Class, Enums, Particle) {
        "use strict";

		
        var DYNAMIC = Enums.DYNAMIC,
            SLEEPING = Enums.SLEEPING;
		
        /**
        * @class Phys2D.Broadphase
        * @extends Class
        * @brief broadphase class
        * @param Object options
        */
        function Broadphase(opts) {
            opts || (opts = Class.OBJECT);

            Class.call(this, opts);
        }

        Class.extend(Broadphase, Class);

        /**
        * @method collisions
        * @memberof Phys2D.Broadphase
        */
        Broadphase.prototype.collisions = function(bodies, pairsi, pairsj) {
			var num = bodies.length,
				bi, bj, shapesi, shapesj, shapesNumi, shapesNumj, si, sj,
				i, j, k, l;
			
			pairsi.length = pairsj.length = 0;
			
			for (i = num; i--;) for (j = 0; j !== i; j++) {
				bi = bodies[i];
				bj = bodies[j];
				
				if (bodiesBroadphase(bi, bj)) continue;

				shapesi = bi.shapes;
				shapesj = bj.shapes;
				shapesNumi = shapesi.length;
				shapesNumj = shapesj.length;
				
				for (k = shapesNumi; k--;) for(l = shapesNumj; l--;) {
					si = shapesi[k];
					sj = shapesj[l];
					
					shapesBroadphase(bi, bj, si, sj, pairsi, pairsj);
				}
			}
        };
		
		
		function bodiesBroadphase(bi, bj) {
			
			if (bi.sleepState === SLEEPING && bj.sleepState === SLEEPING) return true;
			if (bi.motionType !== DYNAMIC && bj.motionType !== DYNAMIC) return true;
			if (bi.aabb && bj.aabb && !bi.aabb.intersects(bj.aabb)) return true;
			
			return false;
		}
		
		
		function shapesBroadphase(bi, bj, si, sj, pairsi, pairsj) {
			
			if(!si && !sj) return;
			if(!si) {
				pairsi.push(bi);
				pairsj.push(sj);
				return;
			}
			if(!sj) {
				pairsi.push(si);
				pairsj.push(bj);
				return;
			}
			if(si.aabb.intersects(sj.aabb)) {
				pairsi.push(si);
				pairsj.push(sj);
				return;
			}
		}


        return Broadphase;
    }
);
