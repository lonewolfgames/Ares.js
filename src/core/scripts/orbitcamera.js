if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
define([
        "base/class",
        "math/mathf",
        "math/vec2",
        "math/vec3",
        "core/input/input",
        "core/components/script"
    ],
    function(Class, Mathf, Vec2, Vec3, Input, Script) {
        "use strict";


        var pow = Math.pow,
            sqrt = Math.sqrt,
            sin = Math.sin,
            cos = Math.cos,
            tan = Math.tan,
            atan2 = Math.atan2,
            min = Math.min,
            max = Math.max,
            PI = Math.PI,
            MIN_POLOR = 0,
            MAX_POLOR = PI,

            degsToRads = Mathf.degsToRads,
            EPSILON = Mathf.EPSILON;

        /**
         * @class OrbitCamera
         * @extends Script
         * @brief set of controls performs orbiting, zooming, and panning
         * @param Object options
         */

        function OrbitCamera(opts) {
            opts || (opts = Class.OBJECT);

            Script.call(this, "OrbitCamera");

            /**
             * @property Number speed
             * @memberof OrbitCamera
             */
            this.speed = opts.speed > EPSILON ? opts.speed : 1;

            /**
             * @property Number zoomSpeed
             * @memberof OrbitCamera
             */
            this.zoomSpeed = opts.zoomSpeed > EPSILON ? opts.zoomSpeed : 2;

            /**
             * @property Boolean allowZoom
             * @memberof OrbitCamera
             */
            this.allowZoom = opts.allowZoom !== undefined ? !! opts.allowZoom : true;

            /**
             * @property Boolean allowPan
             * @memberof OrbitCamera
             */
            this.allowPan = opts.allowPan !== undefined ? !! opts.allowPan : true;

            /**
             * @property Boolean allowRotate
             * @memberof OrbitCamera
             */
            this.allowRotate = opts.allowRotate !== undefined ? !! opts.allowRotate : true;

            /**
             * @property Vec3 target
             * @memberof OrbitCamera
             */
            this.target = opts.target || new Vec3;

            this._offset = new Vec3;
            this._pan = new Vec3;
            this._scale = 1;
            this._thetaDelta = 0;
            this._phiDelta = 0;

            var scope = this,
                state = NONE;

            Input.on("mouseup", function(button) {

                state = NONE;
            });

            Input.on("mousedown", function(button) {

                if (button === 0 && scope.allowRotate) {
                    state = ROTATE;
                } else if (button === 1 && scope.allowPan) {
                    state = PAN;
                }
            });

            Input.on("mousemove", function(button) {
                var update = false,
                    mouseDelta = Input.mouseDelta;

                if (state === ROTATE) {
                    update = true;

                    scope._thetaDelta += 2 * PI * mouseDelta.x / Input.width * scope.speed;
                    scope._phiDelta -= 2 * PI * mouseDelta.y / Input.height * scope.speed;
                } else if (state === PAN) {
                    update = true;

                    scope.pan(mouseDelta);
                }

                update && scope._update();
            });

            Input.on("mousewheel", function(mouseWheel) {
                if (!scope.allowZoom) return;
                var update = false;

                if (mouseWheel > 0) {
                    update = true;
                    scope._scale *= pow(0.95, scope.zoomSpeed);
                } else {
                    update = true;
                    scope._scale /= pow(0.95, scope.zoomSpeed);
                }

                update && scope._update();
            });
        }

        Class.extend(OrbitCamera, Script);


        var panOffset = new Vec3;
        OrbitCamera.prototype.pan = function(delta) {
            var pan = this._pan,
                camera = this.camera,
                transform = this.transform,
                te = transform.matrixWorld.elements,
                position = transform.position,
                targetDistance;

            panOffset.vsub(position, this.target);
            targetDistance = panOffset.length();

            if (!camera.orthographic) {
                targetDistance *= tan(degsToRads(camera.fov * 0.5));

                panOffset.set(te[0], te[1], te[2]).smul(-2 * delta.x * targetDistance / Input.width);
                pan.add(panOffset);

                panOffset.set(te[4], te[5], te[6]).smul(2 * delta.y * targetDistance / Input.height);
                pan.add(panOffset);
            } else {
                targetDistance *= camera.orthographicSize * 0.5;

                panOffset.set(te[0], te[1], te[2]).smul(-2 * delta.x * targetDistance / Input.width);
                pan.add(panOffset);

                panOffset.set(te[4], te[5], te[6]).smul(2 * delta.y * targetDistance / Input.height);
                pan.add(panOffset);
            }
        };


        OrbitCamera.prototype._update = function() {
            var transform = this.transform,
                position = transform.position,
                target = this.target,
                offset = this._offset,
                pan = this._pan,
                theta, phi, radius;

            offset.vsub(position, target);
            theta = atan2(offset.x, offset.y);
            phi = atan2(sqrt(offset.x * offset.x + offset.y * offset.y), offset.z);

            theta += this._thetaDelta;
            phi += this._phiDelta;

            phi = max(MIN_POLOR, min(MAX_POLOR, phi));
            phi = max(EPSILON, min(PI - EPSILON, phi));

            radius = offset.length() * this._scale;

            target.add(pan);

            offset.x = radius * sin(phi) * sin(theta);
            offset.y = radius * sin(phi) * cos(theta);
            offset.z = radius * cos(phi);

            position.vadd(target, offset);
            transform.lookAt(target);

            this._scale = 1;
            this._thetaDelta = 0;
            this._phiDelta = 0;
            pan.set(0, 0, 0);
        };

        OrbitCamera.prototype.onInit = function() {

            this._update();
        };


        var NONE = OrbitCamera.NONE = 1,
            ROTATE = OrbitCamera.ROTATE = 2,
            PAN = OrbitCamera.PAN = 4;


        return OrbitCamera;
    }
);
