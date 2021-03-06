if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
define([
        "base/class"
    ],
    function(Class) {
        "use strict";


        /**
        * @class Asset
        * @extends Component
        * @brief class for holding file information
        * @param String name
        * @param String src
        */

        function Asset(name, src) {

            Class.call(this);

            /**
            * @property String name
            * @memberof Asset
            */
            this.name = typeof(name) === "string" ? name : "Asset-" + this._id;

            /**
            * @property String src
            * @memberof Asset
            */
            this.src = typeof(src) === "string" ? src : "";

            /**
            * @property String ext
            * @memberof Asset
            */
            this.ext = "";

            /**
            * @property Object data
            * @memberof Asset
            * @brief data recieved when loaded
            */
            this.data = undefined;
        }

        Class.extend(Asset, Class);


        return Asset;
    }
);
