if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
define(
    function() {
        "use strict";


        /**
         * @class ObjectPool
         * @brief object Pooling Helper
         * @param Object constructor
         */

        function ObjectPool(constructor) {

            /**
             * @property Array pooled
             * @brief array holding inactive objects
             * @memberof ObjectPool
             */
            this.pooled = [];

            /**
             * @property Array objects
             * @brief array holding active objects
             * @memberof ObjectPool
             */
            this.objects = [];

            /**
             * @property Object constructor
             * @brief reference to constructor object
             * @memberof ObjectPool
             */
            this.object = constructor;
        }

        /**
         * @method create
         * @memberof ObjectPool
         * @brief creates new instance of constructor object, or grabs one from pool if available
         * @return Object
         */
        ObjectPool.prototype.create = function() {
            var pooled = this.pooled,
                object = pooled.length ? pooled.pop() : new this.object;

            this.objects.push(object);

            return object;
        };

        /**
         * @method removeObjects
         * @memberof ObjectPool
         * @brief all arguments passed are removed and pooled
         * @return this
         */
        ObjectPool.prototype.removeObjects = function() {

            for (var i = arguments.length; i--;) this.removeObject(arguments[i]);

            return this;
        };

        /**
         * @method removeObject
         * @memberof ObjectPool
         * @brief removes passed object and pools it
         * @param Object object
         * @return this
         */
        ObjectPool.prototype.removeObject = function(object) {
            var objects = this.objects,
                pooled = this.pooled,
                index = objects.indexOf(object);

            if (index > -1) {
                pooled.push(object);
                objects.splice(index, 1);
            }

            return this;
        };

        /**
         * @method remove
         * @memberof ObjectPool
         * @brief same as removeObjects
         */
        ObjectPool.prototype.remove = ObjectPool.prototype.removeObjects;

        /**
         * @method clear
         * @memberof ObjectPool
         * @brief removes all objects and pools them
         * @return this
         */
        ObjectPool.prototype.clear = function() {
            var objects = this.objects,
                pooled = this.pooled,
                i;

            for (i = objects.length; i--;) pooled.push(objects[i]);
            objects.length = 0;

            return this;
        };


        return ObjectPool;
    }
);
