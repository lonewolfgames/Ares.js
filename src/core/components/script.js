if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
define([
        "base/class",
        "core/components/component"
    ],
    function(Class, Component) {
        "use strict";


        /**
        * @class Script
        * @extends Component
        * @brief base class for manipulating GameObjects and their Components
        * @param String name
        */

        function Script(name) {

            Component.call(this, typeof(name) === "string" ? name : "Script");
        }
        
        Class.extend(Script, Component);


        Script.prototype.copy = function(other) {

            return this;
        };


        Script.prototype.init = function() {

            this.onInit();
        };


        Script.prototype.update = function() {

            this.onUpdate();
        };


        Script.prototype.destroy = function() {
            if (!this.gameObject) return;

            this.gameObject.removeComponent(this);

            this.onDestroy();
        };

        /**
        * @method onInit
        * @memberof Script
        * @brief called when GameObject is added to scene
        */
        Script.prototype.onInit = function() {};

        /**
        * @method onInit
        * @memberof Script
        * @brief called every frame
        */
        Script.prototype.onUpdate = function() {};

        /**
        * @method onDestroy
        * @memberof Script
        * @brief called when this is destroyed
        */
        Script.prototype.onDestroy = function() {};


        return Script;
    }
);
