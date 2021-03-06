if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
define([
        "base/class",
        "base/device",
        "base/dom"
    ],
    function(Class, Device, Dom) {
        "use strict";


        var addEvent = Dom.addEvent,
            removeEvent = Dom.removeEvent,
            addMeta = Dom.addMeta,
            floor = Math.floor,

            SCALE_REG = /-scale\s *=\s*[.0-9]+/g,
            VIEWPORT = "viewport",
            VIEWPORT_WIDTH = "viewport-width",
            VIEWPORT_HEIGHT = "viewport-height",
            CANVAS_STYLE = [
                "background: #000000;",
                "position: absolute;",
                "top: 50%;",
                "left: 50%;",
                "padding:0px;",
                "margin: 0px;"
            ].join("\n");

        addMeta(VIEWPORT, "viewport", "initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no");
        addMeta(VIEWPORT_WIDTH, "viewport", "width=device-width");
        addMeta(VIEWPORT_HEIGHT, "viewport", "height=device-height");

        /**
        * @class Canvas
        * @extends Class
        * @brief canvas helper
        * @param Number width
        * @param Number height
        */

        function Canvas(width, height) {

            Class.call(this);

            /**
            * @property Boolean fullScreen
            * @memberof Canvas
            */
            this.fullScreen = (width === undefined && height === undefined) ? true : false;

            /**
            * @property Number width
            * @memberof Canvas
            */
            this.width = width !== undefined ? width : window.innerWidth;

            /**
            * @property Number height
            * @memberof Canvas
            */
            this.height = height !== undefined ? height : window.innerHeight;

            /**
            * @property Number aspect
            * @memberof Canvas
            */
            this.aspect = this.width / this.height;

            /**
            * @property Number pixelWidth
            * @memberof Canvas
            */
            this.pixelWidth = this.width;

            /**
            * @property Number pixelHeight
            * @memberof Canvas
            */
            this.pixelHeight = this.height;

            /**
            * @property HTMLCanvasElement element
            * @memberof Canvas
            */
            this.element = undefined;
        }

        Class.extend(Canvas, Class);


        Canvas.prototype.init = function() {
            var element = document.createElement("canvas");

            element.style.cssText = CANVAS_STYLE;

            document.body.appendChild(element);

            element.oncontextmenu = function() {
                return false;
            };
            addEvent(window, "resize", this._handleResize, this);

            this.element = element;
            this._handleResize();
        };


        Canvas.prototype.destroy = function() {
            if (!this.element) return;

            removeEvent(window, "resize", this._handleResize, this);
            document.body.removeChild(this.element);
            this.element = undefined;
            canvas.off("resize");
        };

        /**
        * @method setFullscreen
        * @memberof Canvas
        * @brief sets fullScreen boolean
        * @param Number width
        */
        Canvas.prototype.setFullscreen = function(value) {
            if (!this.element || this.fullScreen === value) return;

            this.fullScreen = !! value;
            this._handleResize();
        };

        /**
        * @method setWidth
        * @memberof Canvas
        * @brief sets width and updates aspect
        * @param Number width
        */
        Canvas.prototype.setWidth = function(width) {
            if (!this.element || this.width === width) return;

            this.width = width;
            this.fullScreen = false;
            this.aspect = this.width / this.height;

            this._handleResize();
        };

        /**
        * @method setHeight
        * @memberof Canvas
        * @brief sets height and updates aspect
        * @param Number height
        */
        Canvas.prototype.setHeight = function(height) {
            if (!this.element || this.height === height) return;

            this.height = height;
            this.fullScreen = false;
            this.aspect = this.width / this.height;

            this._handleResize();
        };


        Canvas.prototype._handleResize = function() {
            var viewportScale = document.getElementById(VIEWPORT).getAttribute("content"),
                w = window.innerWidth,
                h = window.innerHeight,
                aspect = w / h,
                element = this.element,
                style = element.style,
                width, height;

            if (this.fullScreen) {
                width = w;
                height = h;
            } else {
                if (aspect > this.aspect) {
                    width = h * this.aspect;
                    height = h;
                } else {
                    width = w;
                    height = w / this.aspect;
                }
            }

            this.pixelWidth = floor(width);
            this.pixelHeight = floor(height);

            element.width = width;
            element.height = height;

            style.marginLeft = -floor(width * 0.5) - 1 + "px";
            style.marginTop = -floor(height * 0.5) - 1 + "px";

            style.width = floor(width) + "px";
            style.height = floor(height) + "px";

            document.getElementById(VIEWPORT).setAttribute("content", viewportScale.replace(SCALE_REG, "-scale=" + Device.invPixelRatio));
            document.getElementById(VIEWPORT_WIDTH).setAttribute("content", "width=" + w);
            document.getElementById(VIEWPORT_HEIGHT).setAttribute("content", "height=" + h);
            window.scrollTo(1, 1);

            this.emit("resize");
        };


        return Canvas;
    }
);
