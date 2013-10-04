if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
define([
        "base/class",
        "base/objectpool",
        "base/dom",
        "base/time",
        "math/mathf",
        "math/vec2",
        "math/vec3",
        "core/input/axis",
        "core/input/buttons",
        "core/input/touch"
    ],
    function(Class, ObjectPool, Dom, Time, Mathf, Vec2, Vec3, Axis, Buttons, Touch) {
        "use strict";


        var min = Math.min,
            max = Math.max,
            abs = Math.abs,

            sign = Mathf.sign,
            clamp = Mathf.clamp,

            touchPool = new ObjectPool(Touch),

            addEvent = Dom.addEvent,
            removeEvent = Dom.removeEvent,
            getGamepads = Dom.getGamepads,

            BUTTON = Axis.BUTTON,
            MOUSE = Axis.MOUSE,
            MOUSE_WHEEL = Axis.MOUSE_WHEEL,
            GAMEPAD = Axis.GAMEPAD;

        /**
         * @class Input
         * @extends Class
         * @brief Input Mananger
         */

        function Input() {

            Class.call(this);

            /**
             * @property HTMLElement element
             * @brief DOM Element events are attached to
             * @memberof Input
             */
            this.element = undefined;

            this.width = 960;
            this.height = 640;

            /**
             * @property Object buttons
             * @brief list of all buttons in use
             * @memberof Input
             */
            this.buttons = Buttons;

            /**
             * @property Vec2 mousePosition
             * @brief mouse current position
             * @memberof Input
             */
            this.mousePosition = new Vec2;

            /**
             * @property Vec2 mouseDelta
             * @brief mouse delta position
             * @memberof Input
             */
            this.mouseDelta = new Vec2;

            /**
             * @property Array touches
             * @brief array of active touches
             * @memberof Input
             */
            this.touches = [];

            /**
             * @property Vec3 acceleration
             * @brief last measured linear acceleration of a device
             * @memberof Input
             */
            this.acceleration = new Vec3;

            /**
             * @property Object axes
             * @brief list of axes in use
             * @memberof Input
             */
            this.axes = {};


            this.addAxis({
                name: "horizontal",
                posButton: "right",
                negButton: "left",
                altPosButton: "d",
                altNegButton: "a",
                type: BUTTON
            });

            this.addAxis({
                name: "vertical",
                posButton: "up",
                negButton: "down",
                altPosButton: "w",
                altNegButton: "s",
                type: BUTTON
            });

            this.addAxis({
                name: "fire",
                posButton: "ctrl",
                negButton: "",
                altPosButton: "mouse0",
                altNegButton: "",
                type: BUTTON
            });

            this.addAxis({
                name: "jump",
                posButton: "space",
                negButton: "",
                altPosButton: "mouse2",
                altNegButton: "",
                type: BUTTON
            });

            this.addAxis({
                name: "mouseX",
                type: MOUSE,
                axis: "x"
            });

            this.addAxis({
                name: "mouseY",
                type: MOUSE,
                axis: "y"
            });

            this.addAxis({
                name: "mouseWheel",
                type: MOUSE_WHEEL
            });
        };

        Class.extend(Input, Class);

        /**
         * @method init
         * @memberof Input
         * @brief attaches events to given element
         * @param HTMLElement element
         */
        Input.prototype.init = function(element) {

            this.element = element;

            addEvent(element, "mousedown mouseup mousemove mouseout mousewheel DOMMouseScroll", handleMouse, this);
            addEvent(top, "keydown keyup", handleKeys, this);

            addEvent(element, "touchstart touchmove touchend touchcancel", handleTouches, this);
            addEvent(window, "devicemotion", handleDevicemotion, this);
        };

        /**
         * @method clear
         * @memberof Input
         * @brief removes events from element
         * @param HTMLElement element
         */
        Input.prototype.clear = function() {
            var element = this.element;

            if (element) {
                removeEvent(element, "mousedown mouseup mousemove mouseout mousewheel DOMMouseScroll", handleMouse, this);
                removeEvent(top, "keydown keyup", handleKeys, this);

                removeEvent(element, "touchstart touchmove touchend touchcancel", handleTouches, this);
                removeEvent(window, "devicemotion", handleDevicemotion, this);
            }

            this.element = undefined;
        };

        /**
         * @method update
         * @memberof Input
         * @brief called ever frame
         */
        Input.prototype.update = function() {
            var axes = this.axes,
                list = Buttons.list,
                button, altButton,
                name, axis, value, sensitivity, pos, neg, tmp, dt = Time.delta,
                element = this.element;

            this.width = element.clientWidth;
            this.height = element.clientHeight;

            mouseWheelNeedsUpdate = true;
            mouseMoveNeedsUpdate = true;
            touchesMoveNeedsUpdate = true;

            for (name in axes) {
                axis = axes[name];
                value = axis.value;
                sensitivity = axis.sensitivity;

                switch (axis.type) {

                    case BUTTON:

                        button = list[axis.negButton];
                        altButton = list[axis.altNegButton];
                        neg = button && button.value || altButton && altButton.value;

                        button = list[axis.posButton];
                        altButton = list[axis.altPosButton];
                        pos = button && button.value || altButton && altButton.value;

                        break;

                    case MOUSE:

                        value = this.mouseDelta[axis.axis];
                        break;

                    case MOUSE_WHEEL:

                        value += mouseWheel;
                        break;
                }

                if (neg) value -= sensitivity * dt;
                if (pos) value += sensitivity * dt;

                if (!pos && !neg) {
                    tmp = abs(value);
                    value -= clamp(sign(value) * axis.gravity * dt, -tmp, tmp);
                }

                value = clamp(value, -1, 1);

                if (abs(value) <= axis.dead) value = 0;

                axis.value = value;
            }

            mouseWheel = 0;
        };

        /**
         * @method addAxis
         * @memberof Input
         * @brief adds new axis to axes
         * @param Object opts
         */
        Input.prototype.addAxis = function(opts) {

            this.axes[opts.name] = new Axis(opts);
        };

        /**
         * @method getAxis
         * @memberof Input
         * @brief returns axis object by name, used to edit axis params
         * @param Object opts
         */
        Input.prototype.getAxis = function(name) {

            return this.axes[name];
        };

        /**
         * @method axis
         * @memberof Input
         * @brief returns the value of the virtual axis identified by axisName
         * @param String axisName
         */
        Input.prototype.axis = function(axisName) {
            var axis = this.axes[axisName];

            return (axis && axis.value) || 0;
        };

        /**
         * @method touch
         * @memberof Input
         * @brief returns object representing status of a specific touch, if no touch returns undefined
         * @param Number num
         */
        Input.prototype.touch = function(num) {
            var touch = this.touches[num];

            return touch && touch.id > -1 ? touch : undefined;
        };

        /**
         * @method mouseButton
         * @memberof Input
         * @brief returns whether the given mouse button is held down
         * @param Number buttonNum
         */
        Input.prototype.mouseButton = function(buttonNum) {
            var button = Buttons.list["mouse" + buttonNum];

            return button && button.value;
        };

        /**
         * @method mouseButtonDown
         * @memberof Input
         * @brief returns true during the frame the user pressed the given mouse button
         * @param Number buttonNum
         */
        Input.prototype.mouseButtonDown = function(buttonNum) {
            var button = Buttons.list["mouse" + buttonNum];

            return button && button.value && (button.frameDown >= Time.frameCount);
        };

        /**
         * @method mouseButtonUp
         * @memberof Input
         * @brief returns true during the frame the user releases the given mouse button
         * @param Number buttonNum
         */
        Input.prototype.mouseButtonUp = function(buttonNum) {
            var button = Buttons.list["mouse" + buttonNum];

            return button && (button.frameUp >= Time.frameCount);
        };

        /**
         * @method key
         * @memberof Input
         * @brief returns true while the user holds down the key identified by name
         * @param String name
         */
        Input.prototype.key = function(name) {
            var button = Buttons.list[name];

            return button && button.value;
        };

        /**
         * @method keyDown
         * @memberof Input
         * @brief returns true during the frame the user starts pressing down the key identified by name
         * @param String name
         */
        Input.prototype.keyDown = function(name) {
            var button = Buttons.list[name];

            return button && button.value && (button.frameDown >= Time.frameCount);
        };

        /**
         * @method keyUp
         * @memberof Input
         * @brief returns true during the frame the user releases the key identified by name
         * @param String name
         */
        Input.prototype.keyUp = function(name) {
            var button = Buttons.list[name];

            return button && (button.frameUp >= Time.frameCount);
        };


        function handleDevicemotion(e) {
            var acc = e.accelerationIncludingGravity,
                acceleration;

            if (acc) {
                acceleration = this.acceleration;

                acceleration.x = acc.x;
                acceleration.y = acc.y;
                acceleration.z = acc.z;

                this.trigger("acceleration");
            }
        }


        var touchesMoveNeedsUpdate = false;

        function handleTouches(e) {
            e.preventDefault();

            var touches = this.touches,
                touch,
                evtTouches = e.touches,
                changedTouches = e.changedTouches,
                evtTouch,
                i;

            switch (e.type) {

                case "touchstart":

                    for (i = evtTouches.length; i--;) {
                        evtTouch = evtTouches[i];
                        touch = touchPool.create();
                        touch.clear();

                        touch.id = evtTouch.identifier;

                        touch.getPosition(evtTouch);

                        this.emit("touchstart", touch);
                        touches.push(touch);
                    }

                    break;

                case "touchend":

                    for (i = changedTouches.length; i--;) {
                        evtTouch = changedTouches[i];
                        touch = touches[i];

                        this.emit("touchend", touch);

                        touchPool.remove(touch);
                        touches.splice(i, 1);
                    }

                    break;

                case "touchcancel":

                    touchPool.clear();
                    this.touches.length = 0;
                    this.emit("touchcancel");

                    break;

                case "touchmove":

                    if (touchesMoveNeedsUpdate) {

                        for (i = changedTouches.length; i--;) {
                            evtTouch = changedTouches[i];
                            touch = touches[i];

                            touch.getPosition(evtTouch);
                            touch._first = true;

                            this.emit("touchmove", touch);
                        }

                        touchesMoveNeedsUpdate = false;
                    }

                    break;
            }
        }


        var mouseFirst = false,
            mouseLast = new Vec2,
            mouseWheel = 0,
            mouse = "mouse",
            mouseWheelNeedsUpdate = false,
            mouseMoveNeedsUpdate = false;

        function handleMouse(e) {
            e.preventDefault();

            switch (e.type) {

                case "mousedown":

                    updateMousePosition(this, e);
                    Buttons.on(mouse + e.button);
                    this.emit("mousedown", e.button);
                    mouseFirst = true;
                    break;

                case "mouseup":

                    updateMousePosition(this, e);
                    Buttons.off(mouse + e.button);
                    this.emit("mouseup", e.button);
                    break;

                case "mouseout":

                    updateMousePosition(this, e);
                    Buttons.off("mouse0");
                    Buttons.off("mouse1");
                    Buttons.off("mouse2");
                    this.emit("mouseout");
                    break;

                case "mousewheel":
                case "DOMMouseScroll":

                    if (mouseWheelNeedsUpdate) {
                        mouseWheel = max(-1, min(1, (e.wheelDelta || -e.detail)));
                        this.emit("mousewheel", mouseWheel);

                        mouseWheelNeedsUpdate = false;
                    }

                    break;

                case "mousemove":

                    if (mouseMoveNeedsUpdate) {

                        updateMousePosition(this, e);
                        mouseMoveNeedsUpdate = false;

                        this.emit("mousemove");
                    }

                    break;
            }
        }


        function updateMousePosition(input, e) {
            var position = input.mousePosition,
                delta = input.mouseDelta,
                element = e.target || e.srcElement,
                offsetX = element.offsetLeft,
                offsetY = element.offsetTop,
                x = (e.pageX || e.clientX) - offsetX,
                y = (e.pageY || e.clientY) - offsetY;

            mouseLast.x = !mouseFirst ? x : position.x;
            mouseLast.y = !mouseFirst ? y : position.y;

            position.x = x;
            position.y = y;

            delta.x = position.x - mouseLast.x;
            delta.y = position.y - mouseLast.y;
        }

        var name;

        function handleKeys(e) {
            e.preventDefault();

            switch (e.type) {

                case "keydown":
                    name = keyCodes[e.keyCode];

                    Buttons.on(name);
                    this.emit("keydown", name);
                    break;

                case "keyup":
                    name = keyCodes[e.keyCode];

                    Buttons.off(name);
                    this.emit("keyup", name);
                    break;
            }
        }


        var keyCodes = {
            8: "backspace",
            9: "tab",
            13: "enter",
            16: "shift",
            17: "ctrl",
            18: "alt",
            19: "pause",
            20: "capslock",
            27: "escape",
            32: "space",
            33: "pageup",
            34: "pagedown",
            35: "end",
            37: "left",
            38: "up",
            39: "right",
            40: "down",
            45: "insert",
            46: "delete",
            112: "f1",
            113: "f2",
            114: "f3",
            115: "f4",
            116: "f5",
            117: "f6",
            118: "f7",
            119: "f8",
            120: "f9",
            121: "f10",
            122: "f11",
            123: "f12",
            144: "numlock",
            145: "scrolllock",
            186: "semicolon",
            187: "equal",
            188: "comma",
            189: "dash",
            190: "period",
            191: "slash",
            192: "graveaccent",
            219: "openbracket",
            220: "backslash",
            221: "closebraket",
            222: "singlequote"
        };

        for (var i = 48; i <= 90; i++) {
            keyCodes[i] = String.fromCharCode(i).toLowerCase();
        }


        return new Input;
    }
);
