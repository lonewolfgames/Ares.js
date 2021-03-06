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
        
        Phys2D.Enums = require("phys2d/enums");
        
        Phys2D.Broadphase = require("phys2d/collision/broadphase");
        Phys2D.Contact = require("phys2d/collision/contact");
        Phys2D.Nearphase = require("phys2d/collision/nearphase");
        
        Phys2D.Circle = require("phys2d/objects/circle");
        Phys2D.Convex = require("phys2d/objects/convex");
        Phys2D.Shape = require("phys2d/objects/shape");
        
        Phys2D.Body = require("phys2d/objects/body");
        Phys2D.Particle = require("phys2d/objects/particle");
        
        Phys2D.Space = require("phys2d/objects/space");


        return Phys2D;
    }
);
