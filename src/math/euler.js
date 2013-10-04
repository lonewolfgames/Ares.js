if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
define([
        "math/mathf"
    ],
    function(Mathf) {
        "use strict";


        var abs = Math.abs,
            sqrt = Math.sqrt,
            acos = Math.acos,
            asin = Math.asin,
            atan2 = Math.atan2,
            
            radsToDegs = Mathf.radsToDegs,
            degsToRads = Mathf.degsToRads;

        function clamp(x) {

            return x < -1 ? -1 : x > 1 ? 1 : x;
        }

        /**
         * @class Euler
         * @brief eular vector
         * @param Number x
         * @param Number y
         * @param Number z
         * @param Number order
         */

        function Euler(x, y, z, order) {

            /**
             * @property Number x
             * @memberof Euler
             */
            this.x = x || 0;

            /**
             * @property Number y
             * @memberof Euler
             */
            this.y = y || 0;

            /**
             * @property Number z
             * @memberof Euler
             */
            this.z = z || 0;


            this._order = order || XYZ;
        }

        /**
         * @method clone
         * @memberof Euler
         * @brief returns new instance of this
         * @return Euler
         */
        Euler.prototype.clone = function() {

            return new Euler(this.x, this.y, this.z);
        };

        /**
         * @method copy
         * @memberof Euler
         * @brief copies other
         * @param Euler other
         * @return this
         */
        Euler.prototype.copy = function(other) {

            this.x = other.x;
            this.y = other.y;
            this.z = other.z;
            this._order = other._order;

            return this;
        };

        /**
         * @method set
         * @memberof Euler
         * @brief sets values of this
         * @param Number x
         * @param Number y
         * @param Number z
         * @return this
         */
        Euler.prototype.set = function(x, y, z) {

            this.x = x;
            this.y = y;
            this.z = z;

            return this;
        };

        /**
         * @method setOrder
         * @memberof Euler
         * @brief sets order of this
         * @return this
         */
        Euler.prototype.setOrder = function(order) {

            order = ~~ (order >= XYZ && order <= ZYX ? order : XYZ);
            this._order = order;

            return this;
        };

        /**
         * @method add
         * @memberof Euler
         * @brief adds other's values to this
         * @param Euler other
         * @return this
         */
        Euler.prototype.add = function(other) {

            this.x += other.x;
            this.y += other.y;
            this.z += other.z;

            return this;
        };

        /**
         * @method eadd
         * @memberof Euler
         * @brief adds a and b together saves it in this
         * @param Euler a
         * @param Euler b
         * @return this
         */
        Euler.prototype.eadd = function(a, b) {

            this.x = a.x + b.x;
            this.y = a.y + b.y;
            this.z = a.z + b.z;

            return this;
        };

        /**
         * @method sadd
         * @memberof Euler
         * @brief adds scalar value to this
         * @param Number s
         * @return this
         */
        Euler.prototype.sadd = function(s) {

            this.x += s;
            this.y += s;
            this.z += s;

            return this;
        };

        /**
         * @method sub
         * @memberof Euler
         * @brief subtracts other's values from this
         * @param Euler other
         * @return this
         */
        Euler.prototype.sub = function(other) {

            this.x -= other.x;
            this.y -= other.y;
            this.z -= other.z;

            return this;
        };

        /**
         * @method esub
         * @memberof Euler
         * @brief subtracts b from a saves it in this
         * @param Euler a
         * @param Euler b
         * @return this
         */
        Euler.prototype.esub = function(a, b) {

            this.x = a.x - b.x;
            this.y = a.y - b.y;
            this.z = a.z - b.z;

            return this;
        };

        /**
         * @method ssub
         * @memberof Euler
         * @brief subtracts this by a scalar value
         * @param Number s
         * @return this
         */
        Euler.prototype.ssub = function(s) {

            this.x -= s;
            this.y -= s;
            this.z -= s;

            return this;
        };

        /**
         * @method mul
         * @memberof Euler
         * @brief muliples this's values by other's
         * @param Euler other
         * @return this
         */
        Euler.prototype.mul = function(other) {

            this.x *= other.x;
            this.y *= other.y;
            this.z *= other.z;

            return this;
        };

        /**
         * @method emul
         * @memberof Euler
         * @brief muliples a and b saves it in this
         * @param Euler a
         * @param Euler b
         * @return this
         */
        Euler.prototype.emul = function(a, b) {

            this.x = a.x * b.x;
            this.y = a.y * b.y;
            this.z = a.z * b.z;

            return this;
        };

        /**
         * @method smul
         * @memberof Euler
         * @brief muliples this by a scalar value
         * @param Number s
         * @return this
         */
        Euler.prototype.smul = function(s) {

            this.x *= s;
            this.y *= s;
            this.z *= s;

            return this;
        };

        /**
         * @method div
         * @memberof Euler
         * @brief divides this's values by other's
         * @param Euler other
         * @return this
         */
        Euler.prototype.div = function(other) {
            var x = other.x,
                y = other.y,
                z = other.z,
                w = other.w;

            this.x *= x !== 0 ? 1 / x : 0;
            this.y *= y !== 0 ? 1 / y : 0;
            this.z *= z !== 0 ? 1 / z : 0;

            return this;
        };

        /**
         * @method ediv
         * @memberof Euler
         * @brief divides b from a saves it in this
         * @param Euler a
         * @param Euler b
         * @return this
         */
        Euler.prototype.ediv = function(a, b) {
            var x = b.x,
                y = b.y,
                z = b.z;

            this.x = x !== 0 ? a.x / x : 0;
            this.y = y !== 0 ? a.y / y : 0;
            this.z = z !== 0 ? a.z / z : 0;

            return this;
        };

        /**
         * @method sdiv
         * @memberof Euler
         * @brief divides this by scalar value
         * @param Number s
         * @return this
         */
        Euler.prototype.sdiv = function(s) {
            s = s === 0 ? 0 : 1 / s;

            this.x *= s;
            this.y *= s;
            this.z *= s;

            return this;
        };

        /**
         * @method length
         * @memberof Euler
         * @brief returns the length of this
         * @return Number
         */
        Euler.prototype.length = function() {
            var x = this.x,
                y = this.y,
                z = this.z,
                lsq = x * x + y * y + z * z;

            if (lsq === 1) return 1;

            return lsq === 0 ? 0 : sqrt(lsq);
        };

        /**
         * @method lengthSq
         * @memberof Euler
         * @brief returns the squared length of this
         * @return Number
         */
        Euler.prototype.lengthSq = function() {
            var x = this.x,
                y = this.y,
                z = this.z;

            return x * x + y * y + z * z;
        };

        /**
         * @method setLength
         * @memberof Euler
         * @brief sets this so its magnitude is equal to length
         * @param Number length
         * @return Euler
         */
        Euler.prototype.setLength = function(length) {
            var x = this.x,
                y = this.y,
                z = this.z,
                l = x * x + y * y + z * z;

            if (l === 1) {
                this.x *= length;
                this.y *= length;
                this.z *= length;

                return this;
            }

            l = l > 0 ? 1 / sqrt(l) : 0;

            this.x *= l * length;
            this.y *= l * length;
            this.z *= l * length;

            return this;
        };

        /**
         * @method normalize
         * @memberof Euler
         * @brief returns this with a length of 1
         * @return this
         */
        Euler.prototype.normalize = function() {
            var x = this.x,
                y = this.y,
                z = this.z,
                l = x * x + y * y + z * z;

            if (l === 1) return this;

            l = l > 0 ? 1 / sqrt(l) : 0;

            this.x *= l;
            this.y *= l;
            this.z *= l;

            return this;
        };

        /**
         * @method inverse
         * @memberof Euler
         * @brief returns the inverse of this
         * @return this
         */
        Euler.prototype.inverse = function() {

            this.x *= -1;
            this.y *= -1;
            this.z *= -1;

            return this;
        };

        /**
         * @method inverseEuler
         * @memberof Euler
         * @brief returns the inverse of other
         * @param Euler other
         * @return this
         */
        Euler.prototype.inverseEuler = function(other) {

            this.x = -other.x;
            this.y = -other.y;
            this.z = -other.z;

            return this;
        };

        /**
         * @method lerp
         * @memberof Euler
         * @brief linear interpolation between this and other by x
         * @param Euler other
         * @param Number x
         * @return Euler
         */
        Euler.prototype.lerp = function(other, x) {

            this.x += (other.x - this.x) * x;
            this.y += (other.y - this.y) * x;
            this.z += (other.z - this.z) * x;

            return this;
        };

        /**
         * @method elerp
         * @memberof Euler
         * @brief linear interpolation between a and b by x
         * @param Euler a
         * @param Euler b
         * @param Number x
         * @return Euler
         */
        Euler.prototype.elerp = function(a, b, x) {
            var ax = a.x,
                ay = a.y,
                az = a.z;

            this.x = ax + (b.x - ax) * x;
            this.y = ay + (b.y - ay) * x;
            this.z = az + (b.z - az) * x;

            return this;
        };

        /**
         * @method edot
         * @memberof Euler
         * @brief dot product of two vectors, can be called as a static function Euler.edot( a, b )
         * @param Euler a
         * @param Euler b
         * @return Number
         */
        Euler.edot = Euler.prototype.edot = function(a, b) {

            return a.x * b.x + a.y * b.y + a.z * b.z;
        };

        /**
         * @method dot
         * @memberof Euler
         * @brief dot product of this and other vector
         * @param Euler other
         * @return Number
         */
        Euler.prototype.dot = function(other) {

            return this.x * other.x + this.y * other.y + this.z * other.z;
        };

        /**
         * @method ecross
         * @memberof Euler
         * @brief cross product between a vector and b vector
         * @param Euler a
         * @param Euler b
         * @return Number
         */
        Euler.prototype.ecross = function(a, b) {
            var ax = a.x,
                ay = a.y,
                az = a.z,
                bx = b.x,
                by = b.y,
                bz = b.z;

            this.x = ay * bz - az * by;
            this.y = az * bx - ax * bz;
            this.z = ax * by - ay * bx;

            return this;
        };

        /**
         * @method cross
         * @memberof Euler
         * @brief cross product between this vector and other
         * @param Euler other
         * @return Number
         */
        Euler.prototype.cross = function(other) {
            var ax = this.x,
                ay = this.y,
                az = this.z,
                bx = other.x,
                by = other.y,
                bz = other.z;

            this.x = ay * bz - az * by;
            this.y = az * bx - ax * bz;
            this.z = ax * by - ay * bx;

            return this;
        };

        /**
         * @method min
         * @memberof Euler
         * @brief returns min values from this and other vector
         * @param Euler other
         * @return this
         */
        Euler.prototype.min = function(other) {
            var ax = this.x,
                ay = this.y,
                az = this.z,
                bx = other.x,
                by = other.y,
                bz = other.z;

            this.x = bx < ax ? bx : ax;
            this.y = by < ay ? by : ay;
            this.z = bz < az ? bz : az;

            return this;
        };

        /**
         * @method max
         * @memberof Euler
         * @brief returns max values from this and other vector
         * @param Euler other
         * @return this
         */
        Euler.prototype.max = function(other) {
            var ax = this.x,
                ay = this.y,
                az = this.z,
                bx = other.x,
                by = other.y,
                bz = other.z;

            this.x = bx > ax ? bx : ax;
            this.y = by > ay ? by : ay;
            this.z = bz > az ? bz : az;

            return this;
        };

        /**
         * @method clamp
         * @memberof Euler
         * @brief clamp values between min and max's values
         * @param Euler min
         * @param Euler max
         * @return this
         */
        Euler.prototype.clamp = function(min, max) {
            var x = this.x,
                y = this.y,
                z = this.z,
                minx = min.x,
                miny = min.y,
                minz = min.z,
                maxx = max.x,
                maxy = max.y,
                maxz = max.z;

            this.x = x < minx ? minx : x > maxx ? maxx : x;
            this.y = y < miny ? miny : y > maxy ? maxy : y;
            this.z = z < minz ? minz : z > maxz ? maxz : z;

            return this;
        };

        /**
         * @method fromVec2
         * @memberof Euler
         * @brief sets values from Vec2
         * @param Vec2 v
         * @return this
         */
        Euler.prototype.fromVec2 = function(v) {

            this.x = v.x;
            this.y = v.y;
            this.z = 0;

            return this;
        };

        /**
         * @method fromVec3
         * @memberof Euler
         * @brief sets values from Vec3
         * @param Vec3 v
         * @return this
         */
        Euler.prototype.fromVec3 = function(v) {

            this.x = v.x;
            this.y = v.y;
            this.z = v.z;

            return this;
        };

        /**
         * @method fromVec4
         * @memberof Euler
         * @brief sets values from Vec4
         * @param Vec4 v
         * @return this
         */
        Euler.prototype.fromVec4 = function(v) {

            this.x = v.x;
            this.y = v.y;
            this.z = v.z;

            return this;
        };

        var ONE = 0.99999;
        /**
         * @method fromMat3
         * @memberof Euler
         * @brief sets values from Mat3
         * @param Mat3 m
         * @return this
         */
        Euler.prototype.fromMat3 = function(m) {
            var te = m.elements,
                m11 = te[0],
                m12 = te[3],
                m13 = te[6],
                m21 = te[1],
                m22 = te[4],
                m23 = te[7],
                m31 = te[2],
                m32 = te[5],
                m33 = te[8],
                order = this._order || XYZ;

            if (order === XYZ) {
                this.y = asin(clamp(m13));

                if (abs(m13) < ONE) {
                    this.x = atan2(-m23, m33);
                    this.z = atan2(-m12, m11);
                } else {
                    this.x = atan2(m32, m22);
                    this.z = 0;
                }
            } else if (order === YXZ) {
                this.x = asin(-clamp(m23));

                if (abs(m23) < ONE) {
                    this.y = atan2(m13, m33);
                    this.z = atan2(m21, m22);
                } else {
                    this.y = atan2(-m31, m11);
                    this.z = 0;
                }
            } else if (order === ZXY) {
                this.x = asin(clamp(m32));

                if (abs(m32) < ONE) {
                    this.y = atan2(-m31, m33);
                    this.z = atan2(-m12, m22);
                } else {
                    this.y = 0;
                    this.z = atan2(m21, m11);
                }
            } else if (order === ZYX) {
                this.y = asin(-clamp(m31));

                if (abs(m31) < ONE) {
                    this.x = atan2(m32, m33);
                    this.z = atan2(m21, m11);
                } else {
                    this.x = 0;
                    this.z = atan2(-m12, m22);
                }
            } else if (order === YZX) {
                this.z = asin(clamp(m21));

                if (abs(m21) < ONE) {
                    this.x = atan2(-m23, m22);
                    this.y = atan2(-m31, m11);
                } else {
                    this.x = 0;
                    this.y = atan2(m13, m33);
                }
            } else if (order === XZY) {
                this.z = asin(-clamp(m12));

                if (abs(m12) < ONE) {
                    this.x = atan2(m32, m22);
                    this.y = atan2(m13, m11);
                } else {
                    this.x = atan2(-m23, m33);
                    this.y = 0;
                }
            }

            return this;
        };

        /**
         * @method fromMat4
         * @memberof Euler
         * @brief sets values from Mat4
         * @param Mat4 m
         * @return this
         */
        Euler.prototype.fromMat4 = function(m) {
            var te = m.elements,
                m11 = te[0],
                m12 = te[4],
                m13 = te[8],
                m21 = te[1],
                m22 = te[5],
                m23 = te[9],
                m31 = te[2],
                m32 = te[6],
                m33 = te[10],
                order = this._order || XYZ;

            if (order === XYZ) {
                this.y = asin(clamp(m13));

                if (abs(m13) < ONE) {
                    this.x = atan2(-m23, m33);
                    this.z = atan2(-m12, m11);
                } else {
                    this.x = atan2(m32, m22);
                    this.z = 0;
                }
            } else if (order === YXZ) {
                this.x = asin(-clamp(m23));

                if (abs(m23) < ONE) {
                    this.y = atan2(m13, m33);
                    this.z = atan2(m21, m22);
                } else {
                    this.y = atan2(-m31, m11);
                    this.z = 0;
                }
            } else if (order === ZXY) {
                this.x = asin(clamp(m32));

                if (abs(m32) < ONE) {
                    this.y = atan2(-m31, m33);
                    this.z = atan2(-m12, m22);
                } else {
                    this.y = 0;
                    this.z = atan2(m21, m11);
                }
            } else if (order === ZYX) {
                this.y = asin(-clamp(m31));

                if (abs(m31) < ONE) {
                    this.x = atan2(m32, m33);
                    this.z = atan2(m21, m11);
                } else {
                    this.x = 0;
                    this.z = atan2(-m12, m22);
                }
            } else if (order === YZX) {
                this.z = asin(clamp(m21));

                if (abs(m21) < ONE) {
                    this.x = atan2(-m23, m22);
                    this.y = atan2(-m31, m11);
                } else {
                    this.x = 0;
                    this.y = atan2(m13, m33);
                }
            } else if (order === XZY) {
                this.z = asin(-clamp(m12));

                if (abs(m12) < ONE) {
                    this.x = atan2(m32, m22);
                    this.y = atan2(m13, m11);
                } else {
                    this.x = atan2(-m23, m33);
                    this.y = 0;
                }
            }

            return this;
        };

        /**
         * @method fromQuat
         * @memberof Euler
         * @brief sets values from Quat
         * @param Quat q
         * @return this
         */
        Euler.prototype.fromQuat = function(q) {
            var x = q.x,
                y = q.y,
                z = q.z,
                w = q.w,
                xx = x * x,
                yy = y * y,
                zz = z * z,
                ww = w * w,
                order = this._order || XYZ;

            if (order === XYZ) {
                this.x = atan2(2 * (x * w - y * z), (ww - xx - yy + zz));
                this.y = asin(clamp(2 * (x * z + y * w)));
                this.z = atan2(2 * (z * w - x * y), (ww + xx - yy - zz));
            } else if (order === YXZ) {
                this.x = asin(clamp(2 * (x * w - y * z)));
                this.y = atan2(2 * (x * z + y * w), (ww - xx - yy + zz));
                this.z = atan2(2 * (x * y + z * w), (ww - xx + yy - zz));
            } else if (order === ZXY) {
                this.x = asin(clamp(2 * (x * w + y * z)));
                this.y = atan2(2 * (y * w - z * x), (ww - xx - yy + zz));
                this.z = atan2(2 * (z * w - x * y), (ww - xx + yy - zz));
            } else if (order === ZYX) {
                this.x = atan2(2 * (x * w + z * y), (ww - xx - yy + zz));
                this.y = asin(clamp(2 * (y * w - x * z)));
                this.z = atan2(2 * (x * y + z * w), (ww + xx - yy - zz));
            } else if (order === YZX) {
                this.x = atan2(2 * (x * w - z * y), (ww - xx + yy - zz));
                this.y = atan2(2 * (y * w - x * z), (ww + xx - yy - zz));
                this.z = asin(clamp(2 * (x * y + z * w)));
            } else if (order === XZY) {
                this.x = atan2(2 * (x * w + y * z), (ww - xx + yy - zz));
                this.y = atan2(2 * (x * z + y * w), (ww + xx - yy - zz));
                this.z = asin(clamp(2 * (z * w - x * y)));
            }

            return this;
        };

        /**
         * @method fromArray
         * @memberof Euler
         * @brief sets values from array
         * @param Array array
         * @return this
         */
        Euler.prototype.fromArray = function(array) {

            this.x = array[0];
            this.y = array[1];
            this.z = array[2];

            return this;
        };

        /**
         * @method fromJSON
         * @memberof Euler
         * @brief sets values from JSON object
         * @param Object json
         * @return this
         */
        Euler.prototype.fromJSON = function(json) {

            this.x = json.x;
            this.y = json.y;
            this.z = json.z;
            this._order = json.order;

            return this;
        };

        /**
         * @method toDegrees
         * @memberof Euler
         * @brief converts values from radians to degrees
         * @return this
         */
        Euler.prototype.toDegrees = function() {

            this.x = radsToDegs( this.x );
            this.y = radsToDegs( this.y );
            this.z = radsToDegs( this.z );

            return this;
        };

        /**
         * @method toRadians
         * @memberof Euler
         * @brief converts values from degrees to radians
         * @return this
         */
        Euler.prototype.toRadians = function() {

            this.x = degsToRads( this.x );
            this.y = degsToRads( this.y );
            this.z = degsToRads( this.z );

            return this;
        };

        /**
         * @method toArray
         * @memberof Euler
         * @brief returns array of this
         * @return Object
         */
        Euler.prototype.toArray = function() {

            return [this.x, this.y, this.z];
        };

        /**
         * @method toJSON
         * @memberof Euler
         * @brief returns json object of this
         * @return Object
         */
        Euler.prototype.toJSON = function() {

            return {
                x: this.x,
                y: this.y,
                z: this.z,
                order: this._order
            };
        };

        /**
         * @method toString
         * @memberof Euler
         * @brief returns string of this
         * @return String
         */
        Euler.prototype.toString = function() {

            return "Euler( " + this.x + ", " + this.y + ", " + this.z + ", order: " + ORDERS[this._order] + " )";
        };

        /**
         * @method equals
         * @memberof Euler
         * @brief checks if this's values equal other's values
         * @param Euler other
         * @return Boolean
         */
        Euler.prototype.equals = function(other) {

            return !(this.x !== other.x || this.y !== other.y || this.z !== other.z);
        };

        /**
         * @method eequals
         * @memberof Euler
         * @brief checks if a's values equal b's values, can be called as a static function Euler.eequals( a, b )
         * @param Euler a
         * @param Euler b
         * @return Boolean
         */
        Euler.eequals = Euler.prototype.eequals = function(a, b) {

            return !(a.x !== b.x || a.y !== b.y || a.z !== b.z);
        };


        var XYZ = Euler.XYZ = 1,
            YZX = Euler.YZX = 2,
            ZXY = Euler.ZXY = 3,
            XZY = Euler.XZY = 4,
            YXZ = Euler.YXZ = 5,
            ZYX = Euler.ZYX = 6,

            ORDERS = ["NO ORDER", "XYZ", "YZX", "ZXY", "XZY", "YXZ", "ZYX"];


        return Euler;
    }
);
