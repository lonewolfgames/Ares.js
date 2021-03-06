if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
define([
        "base/class",
        "base/dom",
        "base/device",
        "base/time",
        "core/app/app",
        "core/app/loop",
        "core/app/settings",
        "core/app/debug",
        "core/assets/assets",
        "core/input/input",
        "core/rendering/canvas",
        "core/rendering/webglrenderer"
    ],
    function(Class, Dom, Device, Time, App, Loop, Settings, Debug, Assets, Input, Canvas, WebGLRenderer) {
        "use strict";


        var now = Time.now,
            MIN_DELTA = 0.00001,
            MAX_DELTA = 0.5;

        /**
        * @class ClientApp
        * @extends App
        * @brief class for managing client application
        * @param Object options
        */

        function ClientApp(opts) {
            opts || (opts = Class.OBJECT);

            App.call(this);
            Settings.fromJSON(opts);

            this._loop = new Loop(loop, this);

            /**
            * @property Canvas canvas
            * @memberof ClientApp
            */
            this.canvas = new Canvas(opts.width, opts.height);

            /**
            * @property WebGLRenderer renderer
            * @memberof ClientApp
            */
            this.renderer = new WebGLRenderer(opts);

            /**
            * @property Scene scene
            * @memberof ClientApp
            */
            this.scene = undefined;

            /**
            * @property Camera(2D) camera
            * @memberof ClientApp
            */
            this.camera = undefined;

            /**
            * @property String id
            * @brief clients socket.io id
            * @memberof ClientApp
            */
            this.id = undefined;

            /**
            * @property socket socket
            * @memberof ClientApp
            */
            this.socket = undefined;
        }

        Class.extend(ClientApp, App);

        /**
        * @method init
        * @memberof ClientApp
        * @brief inits the client application
        */
        ClientApp.prototype.init = function() {
            var canvas = this.canvas;

            canvas.init();
            Input.init(canvas.element);
            this.renderer.init(canvas);

            if (Settings.debug) {
                Debug.init();
                Debug.add("FPS", Time, "fps");
            }

            this._loop.resume();

            this.emit("init");
        };

        /**
        * @method connect
        * @memberof ClientApp
        * @brief connects the client application to the server application
        */
        ClientApp.prototype.connect = function() {
            var scope = this,
                socket;
            
            this.socket = socket = io.connect("http://"+ Settings.host, { port: Settings.port });
            
            socket.on("server_connection", function(id, assets) {
                scope.id = id;
                Assets.fromJSON(assets);
                
                socket.emit("client_connect", Device);
                
                socket.on("server_connect", function() {
                    scope.emit("connect");
                });
            });
        };

        /**
        * @method disconnect
        * @memberof ClientApp
        * @brief disconnect the client application from the server application
        */
        ClientApp.prototype.disconnect = function() {
            
            this.socket && this.socket.disconnect();
            this.emit("disconnect");
        };

        /**
        * @method suspend
        * @memberof ClientApp
        * @brief suspends game loop
        */
        ClientApp.prototype.suspend = function() {

            this._loop.suspend();
            return this;
        };

        /**
        * @method resume
        * @memberof ClientApp
        * @brief resumes game loop
        */
        ClientApp.prototype.resume = function() {

            this._loop.resume();
            return this;
        };

        /**
        * @method isStarted
        * @memberof ClientApp
        * @return Boolean
        */
        ClientApp.prototype.isStarted = function() {

            return this._loop.isStarted();
        };

        /**
        * @method setScene
        * @memberof ClientApp
        * @brief sets active scene
        * @param Scene scene
        */
        ClientApp.prototype.setScene = function(scene) {
            var scenes = this.scenes,
                index = scenes.indexOf(scene);

            if (index > -1) {
                this.scene = scene;
            }

            return this;
        };

        /**
        * @method setCamera
        * @memberof ClientApp
        * @brief sets active camera from GameObject, must have a Camera(2D) Component
        * @param GameObject gameObject
        * @return this
        */
        ClientApp.prototype.setCamera = function(gameObject) {
            var scene = this.scene,
                lastCamera = this.camera,
                index;

            if (!scene) {
                console.warn("ClientApp.setCamera: can\'t set camera without an active scene, use ClientApp.setScene first");
                return this;
            }

            index = scene.gameObjects.indexOf(gameObject);
            if (index < 0) {
                console.warn("ClientApp.setCamera: camera is not a member of the active scene, adding it...");
                scene.addGameObject(gameObject);
            }

            this.camera = gameObject.camera || gameObject.camera2d;

            if (this.camera) {
                this.camera._active = true;
                if (lastCamera) lastCamera._active = false;
            }

            return this;
        };


        var frameCount = 0,
            last = -1 / 60,
            time = 0,
            delta = 1 / 60,
            fpsFrame = 0,
            fpsLast = 0,
            fpsTime = 0;

        function loop(ms) {
            var camera = this.camera,
                scene = this.scene,
                gameObjects,
                i;

            Time.frameCount = frameCount++;

            last = time;
            time = now();
            Time.sinceStart = time;

            fpsTime = time;
            fpsFrame++;

            if (fpsLast + 1 < fpsTime) {
                Time.fps = fpsFrame / (fpsTime - fpsLast);

                fpsLast = fpsTime;
                fpsFrame = 0;
            }

            delta = (time - last) * Time.scale;
            Time.delta = delta < MIN_DELTA ? MIN_DELTA : delta > MAX_DELTA ? MAX_DELTA : delta;

            Time.time = time * Time.scale;

            Input.update();

            if (scene) {
                scene.update();
                if (camera) this.renderer.render(scene, camera);
            }

            this.emit("update", time);
        }


        return ClientApp;
    }
);
