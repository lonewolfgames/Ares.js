if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
define([
        "base/class",
        "core/components/component",
        "core/assets/material"
    ],
    function(Class, Component, Material) {
        "use strict";


        /**
        * @class MeshFilter
        * @extends Component
        * @brief base class for handling meshes
        * @param Object options
        */

        function MeshFilter(opts) {
            opts || (opts = Class.OBJECT);

            Component.call(this, "MeshFilter");

            /**
            * @property Boolean castShadows
            * @memberof MeshFilter
            */
            this.castShadows = opts.castShadows !== undefined ? !! opts.castShadows : true;

            /**
            * @property Boolean receiveShadows
            * @memberof MeshFilter
            */
            this.receiveShadows = opts.receiveShadows !== undefined ? !! opts.receiveShadows : true;

            /**
            * @property Mesh mesh
            * @memberof MeshFilter
            */
            this.mesh = opts.mesh;

            /**
            * @property Material material
            * @memberof MeshFilter
            */
            this.material = opts.material !== undefined ? opts.material : new Material;
        }

		MeshFilter.name = "MeshFilter";
        Class.extend(MeshFilter, Component);


        MeshFilter.prototype.copy = function(other) {

            this.castShadows = other.castShadows;
            this.receiveShadows = other.receiveShadows;

            this.mesh = other.mesh;
            this.material.copy(other.material);

            return this;
        };

        /**
        * @method toJSON
        * @memberof MeshFilter
        * @brief returns this as JSON
        * @return Object
        */
        MeshFilter.prototype.toJSON = function() {
            
            return {
                type: this._type,
                castShadows: this.castShadows,
                receiveShadows: this.receiveShadows,
                mesh: this.mesh && this.mesh.toJSON(),
                material: this.material.toJSON()
            };
        };

        /**
        * @method fromJSON
        * @memberof MeshFilter
        * @brief returns this from JSON object
        * @param Object json
        * @return this
        */
        MeshFilter.prototype.fromJSON = function(json) {
            
            this.castShadows = json.castShadows;
            this.receiveShadows = json.receiveShadows;

            this.mesh = new Mesh().fromJSON(json.mesh);
            this.material = new Material().fromJSON(json.material);
            
            return this;
        };


        return MeshFilter;
    }
);
