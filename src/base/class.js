if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
define(
    function() {
        "use strict";


        var id = 0,
            shift = Array.prototype.shift;

        /**
        * @class Class
        * @brief base class for all objects
        */
        function Class() {

            this._id = id++;
            this._events = {};
        }


        /**
        * @method clone
        * @memberof Class
        * @brief return a new instance of this Object
        */
        Class.prototype.clone = function() {
            var clone = new this.constructor;
            clone.copy(this);

            return clone;
        };

        /**
        * @method copy
        * @memberof Class
        * @brief copies other object, override when extending
        * @param Class other
        */
        Class.prototype.copy = function() {

            return this;
        };

        /**
        * @method on
        * @memberof Class
        * @brief add listener to be called when event type is emitted
        * @param String type
        * @param Function listener
        * @return this
        */
        Class.prototype.on = function(type, listener) {

            (this._events[type] || (this._events[type] = [])).push(listener);

            return this;
        };

        /**
        * @method once
        * @memberof Class
        * @brief add listener to be called when event type is emitted only once
        * @param String type
        * @param Function listener
        * @return this
        */
        Class.prototype.once = function(type, listener) {

            function once() {

                this.off(type, once);
                listener.apply(this, arguments);
            }

            (this._events[type] || (this._events[type] = [])).push(once);

            return this;
        };

        /**
        * @method off
        * @memberof Class
        * @brief removes listener with type, if no type is given all events are removed, if listener not passed all events under type are removed
        * @param String type
        * @param Function listener
        * @return this
        */
        Class.prototype.off = function(type, listener) {
            var events = this._events[type],
                handler,
                i;

            if (!type) {
                events = this._events;
                for (i in events) events[i].length = 0;
                return this;
            }

            if (!events) return this;

            if (!listener) {
                this.emit("off", type, listener);
                events.length = 0;
            } else {
                for (i = events.length; i--;) {
                    handler = events[i];

                    if (listener === handler) {
                        events.splice(i, 1);
                        this.emit("off", type, listener);
                        break;
                    }
                }
            }

            return this;
        };

        /**
        * @method emit
        * @memberof Class
        * @brief emits event, arguments after the type will be passed to the event's callback
        * @param String type
        * @return this
        */
        Class.prototype.emit = function(type) {
            var events = this._events[type],
                i;

            if (!events || !events.length) return this;

            shift.apply(arguments);

            for (i = events.length; i--;) events[i].apply(this, arguments);

            return this;
        };
        
        /**
        * @method onExtend
        * @memberof Class
        * @brief called on extend if defined
        * @param Class child
        */
        Class.prototype.onExtend = undefined;
        
        /**
        * @method Class.extend
        * @memberof Class
        * @brief makes child extend parent, make sure to use parent.call( this ) within the child constructor
        * @param Constructor chlid
        * @param Constructor parent
        */
        Class.extend = function(child, parent) {
            var parentProto = parent.prototype,
                childProto = child.prototype = Object.create(parentProto),
                key;

            for (key in parentProto) {

                if (!childProto.hasOwnProperty(key)) childProto[key] = parentProto[key];
            }

            childProto._super = parentProto;
            childProto.constructor = child;
            
            if( parentProto.onExtend ) parentProto.onExtend( child );
        };


        Class.OBJECT = {};


        return Class;
    }
);
