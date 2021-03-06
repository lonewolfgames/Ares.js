if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
define([
        "base/class",
        "math/color",
        "core/components/component"
    ],
    function(Class, Color, Component) {
        "use strict";


        /**
        * @class Light
        * @extends Component
        * @brief light component, types are 1 - point, 2 - directional, 3 - spot, 4 - hemi
        * @param Object options
        */

        function Light(opts) {
            opts || (opts = Class.OBJECT);

            Component.call(this, "Light");

            /**
            * @property Number lightType
            * @memberof Light
            */
            this.lightType = opts.lightType !== undefined ? opts.lightType : Light.POINT;

            /**
            * @property Color color
            * @memberof Light
            */
            this.color = opts.color !== undefined ? opts.color : new Color(1, 1, 1);

            /**
            * @property Number energy
            * @memberof Light
            */
            this.energy = opts.energy !== undefined ? opts.energy : 1;

            this.constant = 0;
            this.linear = 1;
            this.quadratic = 0;
        }

		Light.name = "Light";
        Class.extend(Light, Component);


        Light.prototype.copy = function(other) {

            this.type = other.type;

            this.color.copy(other.color);
            this.energy = other.energy;

            this.constant = other.constant;
            this.linear = other.linear;
            this.quadratic = other.quadratic;

            return this;
        };

        /**
        * @method toJSON
        * @memberof Light
        * @brief returns this as JSON
        * @return Object
        */
        Light.prototype.toJSON = function() {
            
            return {
                type: this._type,
                lightType: this.type,
                color: this.color.toJSON(),
                energy: this.energy,
                constant: this.constant,
                linear: this.linear,
                quadratic: this.quadratic
            };
        };

        /**
        * @method fromJSON
        * @memberof Light
        * @brief returns this from JSON object
        * @param Object json
        * @return this
        */
        Light.prototype.fromJSON = function(json) {
            
            this.type = json.lightType;
            this.color.fromJSON(json.color);
            this.energy = json.energy;

            this.constant = json.constant;
            this.linear = json.linear;
            this.quadratic = json.quadratic;
            
            return this;
        };


        Light.POINT = 1;
        Light.DIRECTIONAL = 2;
        Light.SPOT = 3;
        Light.HEMI = 4;


        return Light;
    }
);
