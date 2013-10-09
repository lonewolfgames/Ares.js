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
		* @class Phys2D.Contact
		* @brief contact equation
		*/
        function Contact() {

            /**
			* @property Vec2 p
			* @memberof Phys2D.Contact
			*/
            this.p = new Vec2;

            /**
			* @property Vec2 n
			* @memberof Phys2D.Contact
			*/
            this.n = new Vec2;

            /**
			* @property Number s
			* @memberof Phys2D.Contact
			*/
            this.s = 0;

            /**
			* @property Number e
			* @memberof Phys2D.Contact
			*/
            this.e = 1;

            /**
			* @property Number u
			* @memberof Phys2D.Contact
			*/
            this.u = 0;
        }


        return Contact;
    }
);
