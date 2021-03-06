if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
define([
        "base/class",
        "core/components/component"
    ],
    function(Class, Component) {
        "use strict";


        /**
        * @class GameObject
        * @extends Class
        * @brief base class for entities in scenes
        * @param Object options
        */

        function GameObject(opts) {
            opts || (opts = Class.OBJECT);

            Class.call(this);

            /**
            * @property Number _serverId
            * @memberof GameObject
            */
            this._serverId = -1;

            /**
            * @property String name
            * @memberof GameObject
            */
            this.name = opts.name !== undefined ? opts.name : "GameObject-" + this._id;

            /**
            * @property Scene scene
            * @memberof GameObject
            */
            this.scene = undefined;

            /**
            * @property Array tags
            * @memberof GameObject
            */
            this.tags = [];

            /**
            * @property Object components
            * @memberof GameObject
            */
            this.components = {};
            this._componentHash = {};
            this._componentHashServer = {};

            if (opts.tags) this.addTags.apply(this, opts.tags);
            if (opts.components) this.addComponents.apply(this, opts.components);
        }

        Class.extend(GameObject, Class);


        GameObject.prototype.copy = function(other) {
            var components = other.components,
                tags = other.tags,
                scene = other.scene,
                key, i;

            this.clear();

            for (key in components) this.addComponent(components[key].clone());
            for (i = tags.length; i--;) this.addTag(tags[i]);

            if (scene) scene.addGameObject(this);

            return this;
        };

        /**
        * @method clear
        * @memberof GameObject
        * @brief clears GameObject
        * @return this
        */
        GameObject.prototype.clear = function() {
            var components = this.components,
                tags = this.tags,
                i, key;

            for (key in components) this.removeComponent(components[key]);
            for (i = tags.length; i--;) this.removeTag(tags[i]);

            return this;
        };

        /**
        * @method destroy
        * @memberof GameObject
        * @brief destroys GameObject
        * @return this
        */
        GameObject.prototype.destroy = function() {
            if (!this.scene) {
                console.warn("GameObject.destroy: can\'t destroy GameObject if it\'s not added to a Scene");
                return this;
            }
            var components = this.components,
                tags = this.tags,
                i, key;

            this.scene.removeGameObject(this);

            for (key in components) components[key].destroy();
            for (i = tags.length; i--;) this.removeTag(tags[i]);

            this.emit("destroy");

            return this;
        };

        /**
        * @method addTags
        * @memberof GameObject
        * @brief adds all tags in arguments to GameObject
        * @return this
        */
        GameObject.prototype.addTags = function() {

            for (var i = arguments.length; i--;) this.addTag(arguments[i]);

            return this;
        };

        /**
        * @method addTag
        * @memberof GameObject
        * @brief adds tag to GameObject
        * @param Component component
        * @return this
        */
        GameObject.prototype.addTag = function(tag) {
            var tags = this.tags,
                index = tags.indexOf(tag);

            if (index === -1) tags.push(tag);

            return this;
        };

        /**
        * @method removeTags
        * @memberof GameObject
        * @brief removes all tags in arguments from GameObject
        * @return this
        */
        GameObject.prototype.removeTags = function() {

            for (var i = arguments.length; i--;) this.removeTag(arguments[i]);

            return this;
        };

        /**
        * @method removeTag
        * @memberof GameObject
        * @brief removes tag from GameObject
        * @param Component component
        * @return this
        */
        GameObject.prototype.removeTag = function(tag) {
            var tags = this.tags,
                index = tags.indexOf(tag);

            if (index !== -1) tags.splice(index, 1);

            return this;
        };

        /**
        * @method hasTag
        * @memberof GameObject
        * @brief checks if GameObject has tag
        * @param String tag
        */
        GameObject.prototype.hasTag = function(tag) {

            return this.tags.indexOf(tag) !== -1;
        };

        /**
        * @method addComponent
        * @memberof GameObject
        * @brief adds Component to GameObject
        * @param Component component
        * @return this
        */
        GameObject.prototype.addComponent = function(component, others) {
            if (!(component instanceof Component)) {
                console.warn("GameObject.addComponent: can\'t add passed argument, it is not instance of Component");
                return this;
            }
            var type = component._type,
                name = type.toLowerCase(),
                components = this.components,
                key, subKey;

            if (!components[type]) {
                if (component.gameObject) component = component.clone();

                component.gameObject = this;
                components[type] = component;

                this._componentHash[component._id] = component;
                if (component._serverId !== -1) this._componentHashServer[component._serverId] = component;

                this[name] = component;

                if (!others) {
                    for (key in components) {
                        component = components[key];
                        if (!component) continue;

                        for (subKey in components) {
                            name = subKey.toLowerCase();
                            component[name] = components[subKey];
                        }
                    }

                    if (this.scene) this.scene._addComponent(component);
                }
            } else {
                console.warn("GameObject.addComponent: GameObject already has a(n) " + type + " Component");
            }

            return this;
        };

        /**
        * @method addComponents
        * @memberof GameObject
        * @brief adds all Components in arguments to GameObject
        * @return this
        */
        GameObject.prototype.addComponents = function() {
            var scene = this.scene,
                len = arguments.length,
                components = this.components,
                component, name,
                key, subKey, i;

            for (i = len; i--;) this.addComponent(arguments[i], true);

            for (key in components) {
                component = components[key];
                if (!component) continue;

                for (subKey in components) {
                    name = subKey.toLowerCase();
                    component[name] = components[subKey];
                }
            }

            if (scene) {
                for (i = len; i--;) scene._addComponent(arguments[i]);
            }

            return this;
        };

        /**
        * @method add
        * @memberof GameObject
        * @brief same as addComponents
        * @return this
        */
        GameObject.prototype.add = GameObject.prototype.addComponents;

        /**
        * @method removeComponent
        * @memberof GameObject
        * @brief removes Component from GameObject
        * @param Component component
        * @return this
        */
        GameObject.prototype.removeComponent = function(component, others) {
            if (!(component instanceof Component)) {
                console.warn("GameObject.removeComponent: can\'t removed passed argument, it is not instance of Component");
                return this;
            }
            var type = component._type,
                name = type.toLowerCase(),
                components = this.components,
                key, subKey;

            if (components[type]) {

                if (!others) {
                    for (key in components) {
                        component = components[key];
                        if (!component) continue;

                        for (subKey in components) {
                            name = subKey.toLowerCase();
                            component[name] = components[subKey];
                        }
                    }

                    if (this.scene) this.scene._removeComponent(component);
                }

                component.gameObject = undefined;
                components[type] = undefined;

                this._componentHash[component._id] = undefined;
                if (component._serverId !== -1) this._componentHashServer[component._serverId] = undefined;

                this[name] = undefined;
            } else {
                console.warn("GameObject.removeComponent: GameObject does not have a(n) " + type + " Component");
            }

            return this;
        };

        /**
        * @method removeComponents
        * @memberof GameObject
        * @brief removes all Components in arguments from GameObject
        * @return this
        */
        GameObject.prototype.removeComponents = function() {
            var scene = this.scene,
                len = arguments.length,
                components = this.components,
                component, name,
                key, subKey;

            for (var i = len; i--;) this.addComponent(arguments[i], true);

            for (key in components) {
                component = components[key];
                if (!component) continue;

                for (subKey in components) {
                    name = subKey.toLowerCase();
                    component[name] = components[subKey];
                }
            }

            if (scene) {
                for (i = len; i--;) scene._removeComponent(arguments[i]);
            }

            return this;
        };

        /**
        * @method remove
        * @memberof GameObject
        * @brief same as removeComponents
        * @return this
        */
        GameObject.prototype.remove = GameObject.prototype.removeComponents;

        /**
        * @method hasComponent
        * @memberof GameObject
        * @brief checks if GameObject has Component type
        * @param String type
        * @return Boolean
        */
        GameObject.prototype.hasComponent = function(type) {

            return !!this.components[type];
        };

        /**
        * @method getComponent
        * @memberof GameObject
        * @brief returns Component by type
        * @param String type
        * @return Component
        */
        GameObject.prototype.getComponent = function(type) {

            return this.components[type];
        };

        /**
        * @method getComponentById
        * @memberof GameObject
        * @brief returns Component by id
        * @param Number id
        * @return Component
        */
        GameObject.prototype.getComponentById = function(id) {

            return this._componentHash[id];
        };

        /**
        * @method getComponentByServerId
        * @memberof GameObject
        * @brief returns Component by server id
        * @param Number id
        * @return Component
        */
        GameObject.prototype.getComponentByServerId = function(id) {

            return this._componentHashServer[id];
        };

        /**
        * @method toJSON
        * @memberof GameObject
        * @brief returns this as JSON
        * @return Object
        */
        GameObject.prototype.toJSON = function() {
            var components = {},
                thisComponents = this.components,
                tags = [],
                thisTags = this.tags,
                component,
                i;
            
            for (i in thisComponents) {
                component = thisComponents[i];
                
                if (component) components[i] = component.toJSON();
            }
            
            for (i = tags.length; i--;) tags[i] = thisTags[i];
            
            return {
                type: "GameObject",
                name: this.name,
                tags: tags,
                components: components
            };
        };

        /**
        * @method fromJSON
        * @memberof GameObject
        * @brief returns this from JSON object
        * @param Object json
        * @return this
        */
        GameObject.prototype.fromJSON = function(json) {
            var components = json.components,
                jsonComponent,
                component,
                type,
                i;
            
            this.clear();
            
            for (i in components) {
                jsonComponent = components[i];
                
                type = Component._types[jsonComponent.type];
                if (!type) continue;
                
                component = new type;
                if (component instanceof Component) this.addComponent(component.fromJSON(jsonComponent));
            }
            this.addTags.apply(json.tags);
            
            if (this.scene){
                components = this.components;
                for (i in components) {
                    component = components[i];
                    if( component ) component.init();
                }
            }
            
            return this;
        };


        return GameObject;
    }
);
