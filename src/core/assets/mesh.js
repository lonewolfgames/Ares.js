if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
define([
        "base/class",
        "math/aabb3",
        "math/vec2",
        "math/vec3",
        "math/vec4",
        "math/mat4",
        "core/assets/bone"
    ],
    function(Class, AABB3, Vec2, Vec3, Vec4, Mat4, Bone) {
        "use strict";


        var PI = Math.PI,
            HALF_PI = PI * 0.5,
            TWO_PI = PI * 2,
            floor = Math.floor,
            max = Math.max,
            sin = Math.sin,
            cos = Math.cos;

        /**
        * @class Mesh
        * @extends Class
        * @brief base class for handling mesh data, pass JSON object in data to set from
        * @param Object options
        */

        function Mesh(opts) {
            opts || (opts = Class.OBJECT);

            Class.call(this);

            /**
            * @property Array vertices
            * @memberof Mesh
            */
            this.vertices = opts.vertices !== undefined ? opts.vertices : [];

            /**
            * @property Array normals
            * @memberof Mesh
            */
            this.normals = opts.normals !== undefined ? opts.normals : [];

            /**
            * @property Array tangents
            * @memberof Mesh
            */
            this.tangents = opts.tangents !== undefined ? opts.tangents : [];

            /**
            * @property Array faces
            * @memberof Mesh
            */
            this.faces = opts.faces !== undefined ? opts.faces : [];

            /**
            * @property Array colors
            * @memberof Mesh
            */
            this.colors = opts.colors !== undefined ? opts.colors : [];

            /**
            * @property Array uvs
            * @memberof Mesh
            */
            this.uvs = opts.uvs !== undefined ? opts.uvs : [];

            /**
            * @property Array bones
            * @memberof Mesh
            */
            this.bones = opts.bones !== undefined ? opts.bones : [];

            /**
            * @property Array boneIndices
            * @memberof Mesh
            */
            this.boneIndices = opts.boneIndices !== undefined ? opts.boneIndices : [];

            /**
            * @property Array boneWeights
            * @memberof Mesh
            */
            this.boneWeights = opts.boneWeights !== undefined ? opts.boneWeights : [];

            /**
            * @property Object animations
            * @memberof Mesh
            */
            this.animations = opts.animations !== undefined ? opts.animations : {};

            /**
            * @property Boolean dynamic
            * @memberof Mesh
            */
            this.dynamic = opts.dynamic !== undefined ? !! opts.dynamic : false;

            /**
            * @property Boolean useBones
            * @memberof Mesh
            */
            this.useBones = opts.useBones !== undefined ? !! opts.useBones : false;

            /**
            * @property AABB3 aabb
            * @memberof Mesh
            */
            this.aabb = new AABB3;
            if (opts.vertices) this.aabb.fromPoints(this.vertices);

            this._needsUpdate = true;

            if (opts.data) this.fromData(opts.data);
        }

        Class.extend(Mesh, Class);


        Mesh.prototype.copy = function(other) {
            var vertices = this.vertices,
                normals = this.normals,
                tangents = this.tangents,
                colors = this.colors,
                uvs = this.uvs,
                bones = this.bones,
                
                otherVertices = other.vertices,
                otherNormals = other.normals,
                otherTangents = other.tangents,
                otherColors = other.colors,
                otherUvs = other.uvs,
                otherBones = other.bones,
                i, il;
            
            vertices.length = normals.length = tangents.length = colors.length = uvs.length = bones.length = 0;
            
            for (i = 0, il = otherVertices.length; i < il; i++) vertices.push(new Vec3().fromJSON(otherVertices[i]));
            for (i = 0, il = otherNormals.length; i < il; i++) normals.push(new Vec3().fromJSON(otherNormals[i]));
            for (i = 0, il = otherTangents.length; i < il; i++) tangents.push(new Vec4().fromJSON(otherTangents[i]));
            for (i = 0, il = otherColors.length; i < il; i++) colors.push(new Color().fromJSON(otherColors[i]));
            for (i = 0, il = otherUvs.length; i < il; i++) uvs.push(new Vec2().fromJSON(otherUvs[i]));
            for (i = 0, il = otherBones.length; i < il; i++) bones.push(new Bone().fromJSON(otherBones[i]));
            
            this.faces = other.faces.slice(0);
            this.boneWeights = other.boneWeights.slice(0);
            this.boneIndices = other.boneIndices.slice(0);
            
            this.animations = other.animations || {};
            
            return this;
        };


        Mesh.prototype.calculateAABB = function() {

            this.aabb.fromPoints(this.vertices);
        };

        /**
        * @method calculateNormals
        * @memberof Mesh
        * @brief calculates the normals of the mesh from the triangles and vertices
        * @return this
        */
        Mesh.prototype.calculateNormals = function() {
            var u = new Vec3,
                v = new Vec3,
                uv = new Vec3,
                faceNormal = new Vec3;

            return function() {
                var i, il,
                    vertices = this.vertices,
                    normals = this.normals,
                    normal,
                    faces = this.faces,
                    a, b, c,
                    va, vb, vc;

                for (i = vertices.length; i -= 3;) {
                    (normals[i] || (normals[i] = new Vec3)).set(0, 0, 0);
                }

                for (i = faces.length; i -= 3;) {
                    a = i;
                    b = i + 1;
                    c = i + 2;

                    va = vertices[a];
                    vb = vertices[b];
                    vc = vertices[c];

                    u.vsub(vc, vb);
                    v.vsub(va, vb);

                    uv.vcross(u, v);

                    faceNormal.copy(uv).normalize();

                    normals[a].add(faceNormal);
                    normals[b].add(faceNormal);
                    normals[c].add(faceNormal);
                }

                for (i = faces.length; i -= 3;) {
                    normals[i].normalize();
                    normals[i + 1].normalize();
                    normals[i + 2].normalize();
                }

                this._needsUpdate = true;

                return this;
            };
        }();

        /**
        * @method calculateTangents
        * @memberof Mesh
        * @brief calculates the tangents of the mesh from the triangles, vertices and uvs
        * @return this
        */
        Mesh.prototype.calculateTangents = function() {
            var tan1 = [],
                tan2 = [],
                sdir = new Vec3,
                tdir = new Vec3,
                n = new Vec3,
                t = new Vec3,
                tmp1 = new Vec3,
                tmp2 = new Vec3;

            return function() {
                var faces = this.faces,
                    vertices = this.vertices,
                    normals = this.normals,
                    tangents = this.tangents,
                    uvs = this.uvs,

                    v1, v2, v3,
                    w1, w2, w3,

                    x1, x2, y1, y2, z1, z2,
                    s1, s2, t1, t2,
                    a, b, c,

                    r, w, i, il;

                for (i = vertices.length; i--;) {
                    (tan1[i] || (tan1[i] = new Vec3)).set(0, 0, 0);
                    (tan2[i] || (tan2[i] = new Vec3)).set(0, 0, 0);
                    (tangents[i] || (tangents[i] = new Vec4)).set(0, 0, 0, 1);
                }

                for (i = vertices.length; i--;) {
                    uvs[i] = uvs[i] || (uvs[i] = new Vec2);
                }

                for (i = faces.length; i -= 3;) {
                    a = i;
                    b = i + 1;
                    c = i + 2;

                    v1 = vertices[a];
                    v2 = vertices[b];
                    v3 = vertices[c];

                    w1 = uvs[a];
                    w2 = uvs[b];
                    w3 = uvs[c];

                    x1 = v2.x - v1.x;
                    x2 = v3.x - v1.x;
                    y1 = v2.y - v1.y;
                    y2 = v3.y - v1.y;
                    z1 = v2.z - v1.z;
                    z2 = v3.z - v1.z;

                    s1 = w2.x - w1.x;
                    s2 = w3.x - w1.x;
                    t1 = w2.y - w1.y;
                    t2 = w3.y - w1.y;

                    r = s1 * t2 - s2 * t1;
                    r = r !== 0 ? 1 / r : 0;

                    sdir.set(
                        (t2 * x1 - t1 * x2) * r, (t2 * y1 - t1 * y2) * r, (t2 * z1 - t1 * z2) * r
                    );

                    tdir.set(
                        (s1 * x2 - s2 * x1) * r, (s1 * y2 - s2 * y1) * r, (s1 * z2 - s2 * z1) * r
                    );

                    tan1[a].add(sdir);
                    tan1[b].add(sdir);
                    tan1[c].add(sdir);

                    tan2[a].add(tdir);
                    tan2[b].add(tdir);
                    tan2[c].add(tdir);
                }

                for (i = vertices.length; i--;) {
                    t.copy(tan1[i]);
                    n.copy(normals[i]);

                    tmp1.copy(t);
                    tmp1.sub(n.smul(n.dot(t))).normalize();

                    n.copy(normals[i]);
                    tmp2.vcross(n, t);

                    w = (tmp2.dot(tan2[i]) < 0) ? -1 : 1;

                    tangents[i].set(tmp1.x, tmp1.y, tmp1.z, w);
                }

                this._needsUpdate = true;

                return this;
            };
        }();


        Mesh.prototype.addQuad = function(a, b, c, d, uvs, segmentsX, segmentsY) {
            var index = this.vertices.length;

            if (!uvs || !uvs.length || uvs.length != 4) uvs = [0, 1, 0, 1];

            this.uvs.push(
                new Vec2(uvs[1], uvs[2]),
                new Vec2(uvs[0], uvs[2]),
                new Vec2(uvs[0], uvs[3]),
                new Vec2(uvs[1], uvs[3])
            );

            this.colors.push(
                new Vec3(uvs[1], uvs[2], 0),
                new Vec3(uvs[0], uvs[2], 0),
                new Vec3(uvs[0], uvs[3], 0),
                new Vec3(uvs[1], uvs[3], 0)
            );

            this.vertices.push(a, b, c, d);

            this.faces.push(
                index, index + 1, index + 2,
                index, index + 2, index + 3
            );
        };
        
        function arrayToJSON( array ){
            var newArray = [],
                len = array.length,
                i;
            
            for (i=0; i < len; i++) newArray.push(array[i].toJSON());
            
            return newArray;
        }
        
        /**
        * @method toJSON
        * @memberof Mesh
        * @brief returns this as JSON
        * @return Object
        */
        Mesh.prototype.toJSON = function() {
            
            return {
                vertices: arrayToJSON(this.vertices),
                normals: arrayToJSON(this.normals),
                tangents: arrayToJSON(this.tangents),
                faces: this.faces.slice(0),
                colors: arrayToJSON(this.colors),
                uvs: arrayToJSON(this.uvs),
                bones: arrayToJSON(this.bones),
                boneWeights: this.boneWeights.slice(0),
                boneIndices: this.boneIndices.slice(0),
                animations: this.animations
            };
        };
        
        /**
        * @method fromJSON
        * @memberof Mesh
        * @brief returns this from JSON object
        * @param Object json
        * @return this
        */
        Mesh.prototype.fromJSON = function(json) {
            var vertices = this.vertices,
                normals = this.normals,
                tangents = this.tangents,
                colors = this.colors,
                uvs = this.uvs,
                bones = this.bones,
                
                jsonVertices = json.vertices,
                jsonNormals = json.normals,
                jsonTangents = json.tangents,
                jsonColors = json.colors,
                jsonUvs = json.uvs,
                jsonBones = json.bones,
                i, il;
            
            vertices.length = normals.length = tangents.length = colors.length = uvs.length = bones.length = 0;
            
            for (i = 0, il = jsonVertices.length; i < il; i++) vertices.push(new Vec3().fromJSON(jsonVertices[i]));
            for (i = 0, il = jsonNormals.length; i < il; i++) normals.push(new Vec3().fromJSON(jsonNormals[i]));
            for (i = 0, il = jsonTangents.length; i < il; i++) tangents.push(new Vec4().fromJSON(jsonTangents[i]));
            for (i = 0, il = jsonColors.length; i < il; i++) colors.push(new Color().fromJSON(jsonColors[i]));
            for (i = 0, il = jsonUvs.length; i < il; i++) uvs.push(new Vec2().fromJSON(jsonUvs[i]));
            for (i = 0, il = jsonBones.length; i < il; i++) bones.push(new Bone().fromJSON(jsonBones[i]));
            
            this.faces = json.faces.slice(0);
            this.boneWeights = json.boneWeights.slice(0);
            this.boneIndices = json.boneIndices.slice(0);
            
            this.animations = json.animations || {};
            
            return this;
        };

        var EMPTY_ARRAY = [];
        /**
        * @method fromData
        * @memberof Mesh
        * @brief sets mesh data from raw data
        * @param Object data
        * @return this
        */
        Mesh.prototype.fromData = function(data) {
            var vertices = this.vertices,
                normals = this.normals,
                tangents = this.tangents,
                faces = this.faces,
                colors = this.colors,
                uvs = this.uvs,
                bones = this.bones,
                boneWeights = this.boneWeights,
                boneIndices = this.boneIndices,
                bone, bonei, bonej, items, item,
                i, il, j, jl;

            vertices.length = normals.length = tangents.length = faces.length = colors.length = uvs.length = 0;
            bones.length = boneWeights.length = boneIndices.length = 0;

            items = data.vertices || EMPTY_ARRAY;
            for (i = 0, il = items.length; i < il; i += 3) vertices.push(new Vec3(items[i], items[i + 1], items[i + 2]));

            items = data.normals || EMPTY_ARRAY;
            for (i = 0, il = items.length; i < il; i += 3) normals.push(new Vec3(items[i], items[i + 1], items[i + 2]));

            items = data.tangents || EMPTY_ARRAY;
            for (i = 0, il = items.length; i < il; i += 4) tangents.push(new Vec4(items[i], items[i + 1], items[i + 2], items[i + 3]));

            items = data.faces || EMPTY_ARRAY;
            for (i = 0, il = items.length; i < il; i += 3) faces.push(items[i], items[i + 1], items[i + 2]);

            items = data.colors || EMPTY_ARRAY;
            for (i = 0, il = items.length; i < il; i += 3) colors.push(new Color(items[i], items[i + 1], items[i + 2]));

            items = data.uvs || EMPTY_ARRAY;
            for (i = 0, il = items.length; i < il; i += 2) uvs.push(new Vec2(items[i], items[i + 1]));

            items = data.bones || EMPTY_ARRAY;
            for (i = 0, il = items.length; i < il; i++) {
                item = items[i];

                bones.push(
                    new Bone({
                        parentIndex: item.parent,
                        name: item.name,
                        skinned: item.skinned
                    })
                );
            }
            for (i = 0, il = bones.length; i < il; i++) {
                bonei = bones[i];

                for (j = 0, jl = bones.length; j < jl; j++) {
                    bonej = bones[j];
                    if (bonej.parentIndex === i) bonej.parent = bonei;
                }
            }
            if (items.length) this.useBones = true;

            items = data.boneWeights || EMPTY_ARRAY;
            for (i = 0, il = items.length; i < il; i++) boneWeights.push(items[i]);

            items = data.boneIndices || EMPTY_ARRAY;
            for (i = 0, il = items.length; i < il; i++) boneIndices.push(items[i]);

            this.animations = data.animations;
            this.aabb.fromPoints(this.vertices);

            return this;
        };

        /**
        * @method Mesh.Sphere
        * @memberof Mesh
        * @brief creates sphere from radius segments and rings
        * @param Number radius
        * @param Number segments
        * @param Number rings
        * @return Mesh
        */
        Mesh.Sphere = function(radius, segments, rings) {
            radius = radius !== undefined ? radius : 0.5;
            segments = (segments !== undefined ? floor(max(segments, 3)) : 16) + 1;
            rings = (rings !== undefined ? floor(max(rings, 3)) : 8) + 2;

            var R = 1 / (rings - 1),
                S = 1 / (segments - 1),
                r, s,
                x, y, z,
                a, b, c, d,

                mesh = new Mesh,
                vertices = mesh.vertices,
                normals = mesh.normals,
                uvs = mesh.uvs,
                colors = mesh.colors,
                faces = mesh.faces;

            for (r = 0; r < rings; r++)
                for (s = 0; s < segments; s++) {
                    z = sin(-HALF_PI + PI * r * R);
                    x = cos(TWO_PI * s * S) * sin(PI * r * R);
                    y = sin(TWO_PI * s * S) * sin(PI * r * R);

                    vertices.push(new Vec3(x, y, z).smul(radius));
                    normals.push(new Vec3(x, y, z));
                    uvs.push(new Vec2(s * S, r * R));
                    colors.push(new Vec3(s * S, r * R, 0));
                }

            for (r = 0; r < rings - 1; r++)
                for (s = 0; s < segments - 1; s++) {
                    a = r * segments + s;
                    b = r * segments + (s + 1);
                    c = (r + 1) * segments + (s + 1);
                    d = (r + 1) * segments + s;

                    faces.push(a, b, c);
                    faces.push(a, c, d);
                }

            mesh.calculateAABB();

            return mesh;
        };

        /**
        * @method Mesh.Cube
        * @memberof Mesh
        * @brief creates cube from width height and depth
        * @param Number width
        * @param Number height
        * @param Number depth
        * @return Mesh
        */
        Mesh.Cube = function(width, height, depth, widthSegments, heightSegments, depthSegments) {
            var w = (width || 1) * 0.5,
                h = (height || 1) * 0.5,
                d = (depth || 1) * 0.5,

                ws = widthSegments || 1,
                hs = heightSegments || 1,
                ds = depthSegments || 1,

                mesh = new Mesh;

            mesh.addQuad(
                new Vec3(-w, h, -d),
                new Vec3(w, h, -d),
                new Vec3(w, -h, -d),
                new Vec3(-w, -h, -d)
            );

            mesh.addQuad(
                new Vec3(w, h, d),
                new Vec3(-w, h, d),
                new Vec3(-w, -h, d),
                new Vec3(w, -h, d)
            );

            mesh.addQuad(
                new Vec3(w, h, -d),
                new Vec3(w, h, d),
                new Vec3(w, -h, d),
                new Vec3(w, -h, -d)
            );

            mesh.addQuad(
                new Vec3(-w, h, d),
                new Vec3(-w, h, -d),
                new Vec3(-w, -h, -d),
                new Vec3(-w, -h, d)
            );

            mesh.addQuad(
                new Vec3(w, -h, d),
                new Vec3(-w, -h, d),
                new Vec3(-w, -h, -d),
                new Vec3(w, -h, -d)
            );

            mesh.addQuad(
                new Vec3(w, h, d),
                new Vec3(w, h, -d),
                new Vec3(-w, h, -d),
                new Vec3(-w, h, d)
            );

            mesh.calculateAABB();

            return mesh;
        };


        return Mesh;
    }
);
