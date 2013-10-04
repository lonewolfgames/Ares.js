if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
define(
    function() {
        "use strict";


        /**
         * @class Settings
         * @brief settings for application
         */

        function Settings() {

            /**
             * @property Boolean debug
             * @brief is debug on
             * @memberof Settings
             */
            this.debug = false;

            /**
             * @property Boolean forceCanvas
             * @brief force Canvas renderering, affects clients only
             * @memberof Settings
             */
            this.forceCanvas = false;

            /**
             * @property String host
             * @brief server's host url, defaults to machines localhost
             * @memberof Settings
             */
            this.host = "127.0.0.1";

            /**
             * @property Number port
             * @brief server's port, defaults to 3000
             * @memberof Settings
             */
            this.port = 3000;
        }


        Settings.prototype.fromJSON = function(json) {

            for (var key in this)
                if (typeof(json[key]) === typeof(this[key])) this[key] = json[key];
        };


        return new Settings;
    }
);
