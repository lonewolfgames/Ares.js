if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
define([
        "base/class",
		"math/vec2",
		"phys2d/enums",
        "phys2d/objects/shape"
   ],
    function(Class, Vec2, Enums, Shape) {
        "use strict";

        
		var SHAPE_CONVEX = Enums.SHAPE_CONVEX;
		
        /**
        * @class Phys2D.Convex
        * @extends Phys2D.Shape
        * @brief convex shape
        * @param Object options
        */
        function Convex(opts) {
            opts || (opts = Class.OBJECT);

            Shape.call(this, opts);
			
            this._type = SHAPE_CONVEX;
			
			/**
			* @property Array vertices
			* @memberof Phys2D.Convex
			*/
			this.vertices = [];
			
			/**
			* @property Array normals
			* @memberof Phys2D.Convex
			*/
			this.normals = [];
			
			this._vertices = [];
			this._normals = [];
			
			if (opts.extents || !opts.vertices ) {
				var extents = opts.extents || new Vec2( 0.5, 0.5 ),
					x = extents.x,
					y = extents.y;
			
				this.setVertices([
					new Vec2(x, y),
					new Vec2(-x, y),
					new Vec2(-x, -y),
					new Vec2(x, -y)
				]);
			} else {
				this.setVertices(opts.vertices);
			}
        }

        Class.extend(Convex, Shape);

		
		Convex.prototype.copy = function(other) {
			var vertices = other.vertices, vertex,
				normals = other.normals, normal,
				i;
			
			this.density = other.density;
			
			this.localPosition.copy(other.localPosition);
			this.localRotation = other.localRotation;
			
			this.friction = other.friction;
			this.elasticity = other.elasticity;
			
			this.vertices.length = this.normals.length = this._vertices.length = this._normals.length = vertices.length;
			
			for (i = vertices.length; i--;) {
				(this.vertices[i] || (this.vertices[i] = new Vec2)).copy(vertices[i]);
				(this.normals[i] || (this.normals[i] = new Vec2)).copy(normals[i]);
			}
			
			return this;
		};
		
		/**
		* @method setVertices
		* @memberof Phys2D.Convex
		* @param Array vertices
		* @return this
		*/
		Convex.prototype.setVertices = function(vertices) {
			if (!validateVertices(vertices)) {
				console.warn("Convex.setVertices: passed vertices are invalid, creating convex hull from vertices with gift wrapping algorithm");
				vertices = createConvexHull(vertices);
			}
			var wverts = this._vertices,
				len = vertices.length,
				normals = this.normals,
				wnorms = this._normals,
				matrixWorld = this.matrixWorld,
				v1,
				v2,
				i;
			
			for (i = len; i--;) {
				v1 = vertices[i];
				v2 = vertices[(i + 1) % len];
			
				normals[i] = (normals[i] || new Vec2).set(v2.y - v1.y, -(v2.x - v1.x)).normalize();
				
				wverts[i] = (wverts[i] || new Vec2).copy(v1).transformMat32(matrixWorld);
				wnorms[i] = (wnorms[i] || new Vec2).copy(normals[i]).transformMat2(matrixWorld);
			}
			
			this.vertices = vertices;
			
			return this
		};
		
		
		Convex.prototype.pointQuery = function(p) {
			if(!this.aabb.contains(p)) return false;
			var vertices = this._vertices, normals = this._normals,
				px = p.x,
				py = p.y,
				n, nx, ny, v, vx, vy,
				i;
			
			for (i = vertices.length; i--;) {
				n = normals[i];
				nx = n.x; ny = n.y;
				
				v = vertices[i];
				vx = v.x; vy = v.y;
				
				if ((nx * px + ny * py) - (nx * vx + ny * vy) > 0) return false;
			}
			
			return true;
		};
		
		
		Convex.prototype.centroid = function(v) {
			var v1 = new Vec2,
			v2 = new Vec2,
				vsum = new Vec2;
			
			return function(v) {
				var localPos = this.localPosition,
					vertices = this.vertices,
					len = vertices.length,
					area = 0,
					v1x, v1y, v2x, v2y, cross, s,
					i;
					
				vsum.x = vsum.y = 0;
				
				for (i = len; i--;) {
					v1.vadd(localPos, vertices[i]);
					v2.vadd(localPos, vertices[(i + 1) % len]);
					
					v1x = v1.x;
					v1y = v1.y;
					
					v2x = v2.x;
					v2y = v2.y;
					
					cross = v1x * v2y - v1y * v2x;
					area += cross;
					
					vsum.x += (v1x + v2x) * cross;
					vsum.y += (v1y + v2y) * cross;
				}
				
				s = 1 / (3 * area);
				v.x = vsum.x * s;
				v.y = vsum.y * s;
				
				return v;
			};
		}();
		
		
		Convex.prototype.area = function() {
			var vertices = this.vertices,
				len = vertices.length,
				area = 0,
				v1, v2,
				i;
	    
			for(i = len; i--;) {
				v1 = vertices[i];
				v2 = vertices[(i + 1) % len];
				
				area += v1.x * v2.y - v1.y * v2.x;
			}
			
			return area * 0.5;
		};
		
		
		Convex.prototype.inertia = function(mass) {
			var v1 = new Vec2, v2 = new Vec2;
			
			return function(mass) {
				var localPos = this.localPosition,
					vertices = this.vertices,
					len = vertices.length,
					a = 0,
					b = 0,
					sum1 = 0,
					sum2 = 0,
					v1x, v1y, v2x, v2y,
					i;
				
				for (i = len; i--;) {
					v1.vadd(localPos, vertices[i]);
					v2.vadd(localPos, vertices[(i + 1) % len]);
					
					v1x = v1.x;
					v1y = v1.y;
					
					v2x = v2.x;
					v2y = v2.y;
					
					a = v2x * v1y - v2y * v1x;
					b = (v1x * v1x + v1y * v1y) + (v1x * v2x + v1y * v2y) + (v2x * v2x + v2y * v2y);
					
					sum1 += a * b;
					sum2 += a;
				}
				
				return (mass * sum1) / (6 * sum2);
			};
		}();
		
		
		Convex.prototype.update = function(matrix) {
			var localMatrix = this.matrix,
				matrixWorld = this.matrixWorld,
				localPos = this.localPosition,
				
				vertices = this.vertices,
				normals = this.normals,
				pos = this.position,
				r = this.radius,
				
				aabb = this.aabb,
				min = aabb.min,
				max = aabb.max,
				minx = Infinity,
				miny = Infinity,
				maxx = -Infinity,
				maxy = -Infinity,
				
				wnorms = this._normals,
				wverts = this._vertices,
				
				x, y, wnorm, wvert,
				i;
			
			matrixWorld.mmul(matrix, localMatrix);
			
			pos.x = localPos.x;
			pos.y = localPos.y;
			pos.transformMat32(matrix);
			
			for (i = vertices.length; i--;) {
				wvert = wverts[i] || (wverts[i] = new Vec2);
				wnorm = wnorms[i] || (wnorms[i] = new Vec2);
				
				wnorm.copy(normals[i]).transformMat2(matrixWorld);
				wvert.copy(vertices[i]).transformMat32(matrixWorld);
				
				x = wvert.x;
				y = wvert.y;
				
				minx = x < minx ? x : minx;
				miny = y < miny ? y : miny;
				
				maxx = x > maxx ? x : maxx;
				maxy = y > maxy ? y : maxy;
			}
			
			min.x = minx;
			min.y = miny;
			max.x = maxx;
			max.y = maxy;
		};
		
		/**
		* @method Convex.validateVertices
		* @memberof Phys2D.Convex
		* @param Array points
		* @return Boolean
		*/
		var validateVertices = Convex.validateVertices = function (vertices) {
			var len = vertices.length,
				a, b, bx, by, c, abx, aby, bcx, bcy,
				i;
			
			for (i = 0; i < len; i++) {
				a = vertices[i];
				b = vertices[(i+1) % len];
				bx = b.x;
				by = b.y;
				c = vertices[(i+2) % len];
				
				abx = bx - a.x;
				aby = by - a.y;
				bcx = c.x - bx;
				bcy = c.y - by;
				
				if ( (bcx * aby - bcy * abx) > 0) return false;
			}
			
			return true;
		};
		
		/**
		* @method Convex.createConvexHull
		* @memberof Phys2D.Convex
		* @param Array points
		* @return Array
		*/
		var createConvexHull = Convex.createConvexHull = function(){
			var hull = [],
				r = new Vec2,
				v = new Vec2;
			
			return function (points) {
				var rmi = 0,
				rmx = -Infinity,
					n = points.length,
					m = 0,
					newPoints = [],
					failed = false,
					c, v, vx, vy, ih, ie,
					i;
				
				for (i = n; i--;) {
					v = points[i];
					vx = v.x; vy = v.y;
					
					if (vx > rmx ||  (vx == rmx && vy < points[rmi].y)) {
						rmi = i;
						rmx = vx;
					}
				}
				
				hull.length = 0;
				ih = rmi;
				
				while (true) {
					hull[m] = ih;
					
					ie = 0;
					for (i = 1; i < n; i++) {
						if (ie === ih) {
							ie = i;
							continue;
						}
						
						r.vsub (points[ie], points[hull[m]]);
						v.vsub (points[i], points[hull[m]]);
						c = v.cross (r);
						
						if (c < 0) ie = i;
						if (c === 0 && v.lenSq() > r.lenSq()) ie = i;
					}
					
					m++;
					ih = ie;
					
					if (m > n) {
						failed = true;
						break;
					}
					if (ie === rmi) break;
				}
				
				if (failed) {
					console.warn("Convex.createConvexHull: gift wrapping algorithm failed");
					return [
						new Vec2(0.5, 0.5),
						new Vec2(-0.5, 0.5),
						new Vec2(-0.5, -0.5),
						new Vec2(0.5, -0.5)
					];
				}
				
				for (i = m; i--;) {
					newPoints.push(points[hull[i]]);
				}
				
				if (!Convex.validateVertices(newPoints)) {
					console.warn("Convex.createConvexHull: gift wrapping algorithm failed");
					return [
						new Vec2(0.5, 0.5),
						new Vec2(-0.5, 0.5),
						new Vec2(-0.5, -0.5),
						new Vec2(0.5, -0.5)
					];
				}
				
				return newPoints;
			};
		}();


        return Convex;
    }
);
