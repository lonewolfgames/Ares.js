if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
define([
        "base/class",
        "base/time",
        "math/mathf",
        "math/vec2",
        "math/vec3",
        "core/input/input",
        "core/components/script"
    ],
    function(Class, Time, Mathf, Vec2, Vec3, Input, Script) {
        "use strict";


        var EPSILON = Mathf.EPSILON;

        /**
        * @class FlyingCamera
        * @extends Script
        * @brief set of controls performs orbiting, zooming, and panning
        * @param Object options
        */

        function FlyingCamera(opts) {
            opts || (opts = Class.OBJECT);

            Script.call(this, "FlyingCamera");

            /**
            * @property Number speed
            * @memberof FlyingCamera
            */
            this.speed = opts.speed > EPSILON ? opts.speed : 3;

            /**
            * @property Number rotateSpeed
            * @memberof FlyingCamera
            */
            this.rotateSpeed = opts.rotateSpeed > EPSILON ? opts.rotateSpeed : 3;

            this._velocity = new Vec3;
        }

        Class.extend(FlyingCamera, Script);


        var vec = new Vec3,
            forward = new Vec3(0, 1, 0);
        
        FlyingCamera.prototype.onInit = function() {
            var scope = this,
                transform = this.transform,
                moving = false;

            transform.lookAt(vec.vadd(transform.position, forward));

            Input.on("mouseup", function(button) {
                if (button === 0) moving = false;
            });

            Input.on("mousedown", function(button) {
                if (button === 0) moving = true;
            });

            Input.on("mousemove", function(button) {
                if (!moving) return;
                var transform = scope.transform,
                    delta = Input.mouseDelta,
                    speed = scope.rotateSpeed,
                    x = speed * (delta.x / Input.width),
                    y = speed * (delta.y / Input.height);

                transform.rotation.rotateY(-x);
                transform.rotation.rotateX(-y);
            });
        };


        FlyingCamera.prototype.onUpdate = function() {
            var transform = this.transform,
                vel = this._velocity,
                speed = this.speed;

            if (Input.key("w") || Input.key("up")) {
                vel.z -= speed;
            }
            if (Input.key("s") || Input.key("down")) {
                vel.z += speed;
            }
            if (Input.key("a") || Input.key("left")) {
                vel.x -= speed;
            }
            if (Input.key("d") || Input.key("right")) {
                vel.x += speed;
            }

            vel.smul(Time.delta);
            transform.translate(vel, transform.rotation);
        };


        return FlyingCamera;
    }
);
