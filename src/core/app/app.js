if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
define([
        "base/class",
        "core/scene"
    ],
    function(Class, Scene) {
        "use strict";


        /**
         * @class App
         * @extends Class
         * @brief base class for managing applications
         * @param Object options
         */

        function App(opts) {
            opts || (opts = Class.OBJECT);

            Class.call(this);

            /**
             * @property Array scenes
             * @memberof App
             */
            this.scenes = [];
            this._sceneHash = {};
            this._sceneHashServer = {};
            this._sceneNameHash = {};
        }

        Class.extend(App, Class);


        /**
         * @method addScene
         * @memberof App
         * @brief adds Scene to App
         * @param Scene scene
         * @return this
         */
        App.prototype.addScene = function(scene) {
            if (!(scene instanceof Scene)) {
                console.warn("App.addScene: can\'t add passed argument, it is not instance of Scene");
                return this;
            }
            var scenes = this.scenes,
                index = scenes.indexOf(scene);

            if (index === -1) {
                if (scene.app) scene.app.removeScene(scene);

                scene.app = this;
                scenes.push(scene);

                this._sceneHash[scene._id] = scene;
                if (scene._serverId !== -1) this._sceneHashServer[scene._serverId] = scene;

                this._sceneNameHash[scene.name] = scene;
            } else {
                console.warn("App.addScene: Scene is already a member of this");
            }

            return this;
        };

        /**
         * @method addScenes
         * @memberof App
         * @brief adds all Scenes in arguments to App
         * @return this
         */
        App.prototype.addScenes = function() {

            for (var i = arguments.length; i--;) this.addScene(arguments[i]);

            return this;
        };

        /**
         * @method removeScene
         * @memberof App
         * @brief removes Scene from App
         * @param Scene scene
         * @return this
         */
        App.prototype.removeScene = function(scene) {
            if (!(scene instanceof Scene)) {
                console.warn("App.removeScene: can\'t remove passed argument, it is not instance of Scene");
                return this;
            }
            var scenes = this.scenes,
                index = scenes.indexOf(scene);

            if (index > -1) {
                scene.app = undefined;
                scenes.splice(index, 1);

                this._sceneHash[scene._id] = undefined;
                if (scene._serverId !== -1) this._sceneHashServer[scene._serverId] = undefined;

                this._sceneNameHash[scene.name] = undefined;
            } else {
                console.warn("App.removeScene: Scene is not a member of this");
            }

            return this;
        };

        /**
         * @method removeScenes
         * @memberof Scene
         * @brief removes all Scenes in arguments from App
         * @return this
         */
        App.prototype.removeScenes = function() {

            for (var i = arguments.length; i--;) this.removeScene(arguments[i]);

            return this;
        };

        /**
         * @method getSceneByName
         * @memberof App
         * @brief returns Scene by name
         * @param String name
         * @return Scene
         */
        App.prototype.getSceneByName = function(name) {

            return this._sceneNameHash[name];
        };

        /**
         * @method getSceneById
         * @memberof App
         * @brief returns Scene by id
         * @param Number id
         * @return Scene
         */
        App.prototype.getSceneById = function(id) {

            return this._sceneHash[id];
        };

        /**
         * @method getGameObjectByServerId
         * @memberof App
         * @brief returns GameObject by server id
         * @param Number id
         * @return Scene
         */
        App.prototype.getSceneByServerId = function(id) {

            return this._sceneHashServer[id];
        };


        return App;
    }
);
