if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
define(
    function() {
        "use strict";
		
		
		var Enums = {
				STATIC: 0,
				KINEMATIC: 0,
				DYNAMIC: 0,
				
				PARTICLE: 0,
				BODY: 0,
				RIGIDBODY: 0,
	
				AWAKE: 0,
				SLEEPY: 0,
				SLEEPING: 0,
				
				SHAPE_NONE: 0,
				SHAPE_CIRCLE: 0,
				SHAPE_CONVEX: 0,
				SHAPE_SEGMENT: 0
			},
			key, i = 1;
		
		for ( key in Enums) { Enums[ key ] = i++ }

        return Enums;
    }
);
