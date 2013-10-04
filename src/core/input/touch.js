if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
define([
        "base/class",
        "math/vec2"
    ],
    function(Vec2) {
        "use strict";

        /**
         * @class Touch
         * @brief touch helper for touch enabled devices
         */

        function Touch() {

            /**
             * @property Number id
             * @memberof Touch
             */
            this.id = -1;

            /**
             * @property Vec2 delta
             * @memberof Touch
             */
            this.delta = new Vec2;

            /**
             * @property Vec2 position
             * @memberof Touch
             */
            this.position = new Vec2;

            this._last = new Vec2;
            this._first = false;
        };


        Touch.prototype.clear = function() {

            this.id = -1;

            this.position.set(0, 0);
            this.delta.set(0, 0);
            this._last.set(0, 0);

            this._first = false;
        };


        Touch.prototype.getPosition = function(e) {
            var position = this.position,
                delta = this.delta,
                last = this._last,
                first = this._first,
                element = e.target || e.srcElement,
                offsetX = element.offsetLeft,
                offsetY = element.offsetTop,
                x = (e.pageX || e.clientX) - offsetX,
                y = (e.pageY || e.clientY) - offsetY;

            last.x = !first ? x : position.x;
            last.y = !first ? y : position.y;

            position.x = x;
            position.y = y;

            delta.x = position.x - last.x;
            delta.y = position.y - last.y;
        };


        Touch.prototype.toJSON = function() {
            var json = this._JSON;

            json.id = this.id;
            json.position = this.position;
            json.delta = this.delta;

            return json;
        };


        return Touch;
    }
);
