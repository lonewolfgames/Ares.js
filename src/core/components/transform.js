if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
define([
        "base/class",
        "math/mathf",
        "math/vec3",
        "math/quat",
        "math/mat4",
        "core/components/component"
    ],
    function(Class, Mathf, Vec3, Quat, Mat4, Component) {
        "use strict";


        var EPSILON = Mathf.EPSILON;

        /**
        * @class Transform
        * @extends Class
        * @brief position, rotation, and scale
        * @param Object options
        */

        function Transform(opts) {
            opts || (opts = Class.OBJECT);

            Component.call(this, "Transform");

            /**
            * @property Transform root
            * @memberof Transform
            */
            this.root = this;

            /**
            * @property Number depth
            * @memberof Transform
            */
            this.depth = 0;

            /**
            * @property Transform parent
            * @memberof Transform
            */
            this.parent = undefined;

            /**
            * @property Array children
            * @memberof Transform
            */
            this.children = [];

            /**
            * @property Vec3 position
            * @memberof Transform
            */
            this.position = opts.position !== undefined ? opts.position : new Vec3;

            /**
            * @property Number rotation
            * @memberof Transform
            */
            this.rotation = opts.rotation !== undefined ? opts.rotation : new Quat;

            /**
            * @property Vec3 scale
            * @memberof Transform
            */
            this.scale = opts.scale !== undefined ? opts.scale : new Vec3(1, 1, 1);

            /**
            * @property Mat4 matrix
            * @memberof Transform
            */
            this.matrix = new Mat4;

            /**
            * @property Mat4 matrixWorld
            * @memberof Transform
            */
            this.matrixWorld = new Mat4;

            /**
            * @property Mat4 modelView
            * @memberof Transform
            */
            this.modelView = new Mat4;
            this._modelViewNeedsUpdate = false;
        }
        
        Transform.name = "Transform";
        Class.extend(Transform, Component);


        Transform.prototype.copy = function(other) {
            var children = other.children,
                child, gameObject,
                i;

            this.position.copy(other.position);
            this.scale.copy(other.scale);
            this.rotation.copy(other.rotation);
            this.root = other.root;

            for (i = children.length; i--;) this.add(children[i].gameObject.clone().transform);

            if (other.parent) other.parent.add(this);

            return this;
        };

        /**
        * @method translate
        * @memberof Transform
        * @brief translates this by translation along relativeTo's rotation
        * @param Vec3 translation
        * @param Transform translation
        * @param Transform relativeTo
        * @return this
        */
        Transform.prototype.translate = function() {
            var vec = new Vec3;

            return function(translation, relativeTo) {
                vec.copy(translation);

                if (relativeTo instanceof Transform) {
                    vec.transformQuat(relativeTo.rotation);
                } else if (relativeTo instanceof Quat) {
                    vec.transformQuat(relativeTo);
                }

                this.position.add(vec);

                return this;
            };
        }();

        /**
        * @method rotate
        * @memberof Transform
        * @brief rotates this by rotation relative to relativeTo's rotation
        * @param Vec3 rotation
        * @param Transform relativeTo
        * @return this
        */
        Transform.prototype.rotate = function() {
            var vec = new Vec3;

            return function(rotation, relativeTo) {
                vec.copy(rotation);

                if (relativeTo instanceof Transform) {
                    vec.transformQuat(relativeTo.rotation);
                } else if (relativeTo instanceof Quat) {
                    vec.transformQuat(relativeTo);
                }

                this.rotation.rotate(vec.x, vec.y, vec.z);

                return this;
            };
        }();

        /**
        * @method lookAt
        * @memberof Transform
        * @brief makes this look at a transform
        * @param Transform target
        * @param Vec3 up
        * @return this
        */
        Transform.prototype.lookAt = function() {
            var mat = new Mat4,
                vec = new Vec3,
                dup = new Vec3(0, 0, 1);

            return function(target, up) {
                up = up || dup;

                if (target instanceof Transform) {
                    vec.copy(target.position);
                } else {
                    vec.copy(target);
                }

                mat.lookAt(this.position, vec, up);
                this.rotation.fromMat4(mat);

                return this;
            };
        }();

        /**
        * @method follow
        * @memberof Transform
        * @brief makes this follow a transform
        * @param Transform transform
        * @param Number speed
        * @return this
        */
        Transform.prototype.follow = function() {
            var target = new Vec3,
                position = new Vec3,
                delta = new Vec3;

            return function(transform, speed) {
                position.set(0, 0, 0).transformMat4(this.matrixWorld);
                target.set(0, 0, 0).transformMat4(transform.matrixWorld);

                delta.vsub(target, position);

                if (delta.lengthSq() > EPSILON) this.position.add(delta.smul(speed));

                return this;
            };
        }();

        /**
        * @method addChild
        * @memberof Transform
        * @brief add transform to this transforms children
        * @return this
        */
        Transform.prototype.addChild = function(child) {
            if (!(child instanceof Transform)) {
                console.warn("Transform.add: can\'t add passed argument, it is not instance of Transform");
                return this;
            }
            var children = this.children,
                index = children.indexOf(child),
                root, depth;

            if (index < 0) {
                if (child.parent) child.parent.remove(child);

                child.parent = this;
                children.push(child);

                root = this;
                depth = 0;

                while (root.parent) {
                    root = root.parent;
                    depth++;
                }
                child.root = root;
                this.root = root;

                updateDepth(this, depth);
            } else {
                console.warn("Transform.add: child is not a member of this Transform");
            }

            return this;
        };

        /**
        * @method addChildren
        * @memberof Transform
        * @brief adds all transforms in arguments to this transforms children
        * @return this
        */
        Transform.prototype.addChildren = function() {

            for (var i = arguments.length; i--;) this.addChild(arguments[i]);

            return this;
        };

        /**
        * @method add
        * @memberof Transform
        * @brief same as addChildren
        * @return this
        */
        Transform.prototype.add = Transform.prototype.addChildren;

        /**
        * @method removeChild
        * @memberof Transform
        * @brief remove transform from this transforms children
        * @return this
        */
        Transform.prototype.removeChild = function(child) {
            var children = this.children,
                index = children.indexOf(child),
                root, depth;

            if (index > -1) {
                child.parent = undefined;
                children.splice(index, 1);

                root = this;
                depth = 0;

                while (root.parent) {
                    root = root.parent;
                    depth++;
                }
                child.root = child;
                this.root = root;

                updateDepth(this, depth);
            } else {
                console.warn("Transform.remove: child is not a member of this Transform");
            }

            return this;
        };

        /**
        * @method removeChildren
        * @memberof Transform
        * @brief removes all transforms in arguments from this transforms children
        * @return this
        */
        Transform.prototype.removeChildren = function() {

            for (var i = arguments.length; i--;) this.removeChild(arguments[i]);

            return this;
        };

        /**
        * @method remove
        * @memberof Transform
        * @brief same as removeChildren
        * @return this
        */
        Transform.prototype.remove = Transform.prototype.removeChildren;

        /**
        * @method detachChildren
        * @memberof Transform
        * @brief removes all children from this transforms children
        * @return this
        */
        Transform.prototype.detachChildren = function() {
            var children = this.children,
                i;

            for (i = children.length; i--;) this.removeChild(children[i]);

            return this;
        };

        /**
        * @method toWorld
        * @memberof Transform
        * @brief returns vector in this Transform's world space
        * @param Vec3 v
        * @return Vec3
        */
        Transform.prototype.toWorld = function(v) {

            return v.transformMat4(this.matrixWorld);
        };

        /**
        * @method toWorld
        * @memberof Transform
        * @brief returns vector in this Transform's local space
        * @param Vec3 v
        * @return Vec3
        */
        Transform.prototype.toLocal = function() {
            var mat = new Mat4;

            return function(v) {

                return v.transformMat4(mat.inverseMat(this.matrixWorld));
            };
        }();

        /**
        * @method update
        * @memberof Transform
        * @brief updates world and local matrix
        * @return this
        */
        Transform.prototype.update = function() {
            var matrix = this.matrix,
                parent = this.parent;

            matrix.compose(this.position, this.scale, this.rotation);

            if (parent) {
                this.matrixWorld.mmul(parent.matrixWorld, matrix);
            } else {
                this.matrixWorld.copy(matrix);
            }

            this._modelViewNeedsUpdate = true;
        };


        Transform.prototype.updateModelView = function(camera) {
            if (!this._modelViewNeedsUpdate) return;

            this.modelView.mmul(camera.view, this.matrixWorld);
            this._modelViewNeedsUpdate = false;
        };


        Transform.prototype.sort = function(a, b) {

            return b.depth - a.depth;
        };

        /**
        * @method toJSON
        * @memberof Transform
        * @brief returns this as JSON
        * @return Object
        */
        Transform.prototype.toJSON = function() {
            var parent = this.parent,
                parentId = parent ? parent.id : -1;
            
            return {
                type: this._type,
                parent: parentId,
                position: this.position.toJSON(),
                scale: this.scale.toJSON(),
                rotation: this.rotation.toJSON()
            };
        };

        /**
        * @method fromJSON
        * @memberof Transform
        * @brief returns this from JSON object
        * @param Object json
        * @return this
        */
        Transform.prototype.fromJSON = function(json) {
            
            this.position.fromJSON(json.position);
            this.scale.fromJSON(json.scale);
            this.rotation.fromJSON(json.rotation);
            
            return this;
        };


        function updateDepth(transform, depth) {
            var children = transform.children,
                i;

            transform.depth = depth;

            for (i = children.length; i--;) updateDepth(children[i], depth + 1);
        }


        return Transform;
    }
);
