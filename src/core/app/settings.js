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
            this.host = "localhost";

            /**
            * @property Number port
            * @brief server's port, defaults to 3000
            * @memberof Settings
            */
            this.port = 3000;
        }


        Settings.prototype.fromJSON = function(json) {
            var key, value;
            
            for (key in this) {
                value = json[key];
                
                if (typeof(value) === typeof(this[key])) {
                    this[key] = json[key];
                } else if ( value ) {
                    console.warn("Settings: type for Settings value "+ key +" is invalid using default");
                }
            }
        };


        return new Settings;
    }
);
