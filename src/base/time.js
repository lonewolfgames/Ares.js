if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
define(
    function() {
        "use strict";


        if (!Date.now) {
            Date.now = function now() {

                return new Date().getTime();
            };
        }

        var defineProperty = Object.defineProperty,
            START_MS = Date.now(),
            START = START_MS * 0.001,
            now, delta = 1 / 60,
            fixedDelta = delta,
            globalFixed = delta,
            scale = 1;

        /**
         * @class Time
         * @brief object to get time information
         */

        function Time() {

            /**
             * @property Number start
             * @brief start time stamp of game
             * @memberof Time
             */
            this.start = START;

            /**
             * @property Number sinceStart
             * @brief real time in seconds since the game started
             * @memberof Time
             */
            this.sinceStart = 0;

            /**
             * @property Number time
             * @brief time that this frame started
             * @memberof Time
             */
            this.time = 0;

            /**
             * @property Number fps
             * @brief number of frames/second
             * @memberof Time
             */
            this.fps = 60;

            /**
             * @property Number delta
             * @brief time in seconds it took to complete the last frame
             * @memberof Time
             */
            this.delta = delta;

            /**
             * @property Number frameCount
             * @brief total number of frames that have passed since start
             * @memberof Time
             */
            this.frameCount = 0;

            /**
             * @property Number scale
             * @brief scale at which time is passing
             * @memberof Time
             */
            defineProperty(this, "scale", {
                get: function() {
                    return scale;
                },
                set: function(value) {
                    scale = value;
                    fixedDelta = globalFixed * value
                }
            });

            /**
             * @property Number fixedDelta
             * @brief interval in seconds at which physics and other fixed frame rate updates are performed
             * @memberof Time
             */
            defineProperty(this, "fixedDelta", {
                get: function() {
                    return fixedDelta;
                },
                set: function(value) {
                    globalFixed = value;
                    fixedDelta = globalFixed * scale;
                }
            });
        }

        /**
         * @method now
         * @memberof Time
         * @brief returns time in seconds since start of game
         * @return Number
         */
        Time.prototype.now = now = function() {
            var w = typeof window !== "undefined" ? window : {},
                performance = typeof w.performance !== "undefined" ? w.performance : {};

            performance.now = (
                performance.now ||
                performance.webkitNow ||
                performance.mozNow ||
                performance.msNow ||
                performance.oNow ||
                function() {
                    return Date.now() - START_MS;
                }
            );

            return function() {

                return performance.now() * 0.001;
            }
        }();

        /**
         * @method stamp
         * @memberof Time
         * @brief time stamp in seconds
         * @return Number
         */
        Time.prototype.stamp = function() {

            return START + now();
        };


        return new Time;
    }
);
