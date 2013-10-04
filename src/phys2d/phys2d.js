if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
define(
    function(require) {
        "use strict";

        /**
         * @library Phys2D.js
         * @version 0.0.1
         * @brief Javascript Physics Engine
         */

        /**
         * @class Phys2D
         * @brief namespace
         */
        var Phys2D = {};


        Phys2D.Class = require("base/class");


        return Phys2D;
    }
);
