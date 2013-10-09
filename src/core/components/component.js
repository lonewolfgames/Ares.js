if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
define([
        "base/class"
    ],
    function(Class) {
        "use strict";

        /**
        * @class Component
        * @extends Class
        * @brief base class for all components
        * @param String type
        */

        function Component(type) {

            Class.call(this);

            /**
            * @property Number _serverId
            * @memberof GameObject
            */
            this._serverId = -1;

            /**
            * @property String type
            * @memberof Component
            */
            this._type = type;

            /**
            * @property GameObject gameObject
            * @memberof Component
            */
            this.gameObject = undefined;
        }

        Class.extend(Component, Class);
        
        
        Component.prototype.onExtend = function(child) {
            
            Component._types[child.name] = child;
        };
        

        Component.prototype.init = function() {

        };


        Component.prototype.update = function() {

        };


        Component.prototype.clear = function() {

        };


        Component.prototype.destroy = function() {
            if (!this.gameObject) {
                console.warn("Component.destroy: can\'t destroy Component if it\'s not added to a GameObject");
                return this;
            }

            this.gameObject.removeComponent(this);
            this.emit("destroy");

            return this;
        };


        Component.prototype.sort = function(a, b) {

            return a === b ? -1 : 1;
        };

        /**
        * @method toJSON
        * @memberof Component
        * @brief returns this as JSON
        * @return Object
        */
        Component.prototype.toJSON = function() {
            
            return {
                type: this._type
            };
        };

        /**
        * @method fromJSON
        * @memberof Component
        * @brief returns this from JSON object
        * @param Object json
        * @return Object
        */
        Component.prototype.fromJSON = function(json) {
            
            return this;
        };
        
        
        Component._types = {};


        return Component;
    }
);
