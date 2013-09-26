if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"core/components/component",
	"core/assets/material"
    ],
    function( Class, Component, Material ){
        "use strict";
	
	
        /**
	 * @class MeshFilter
	 * @extends Component
	 * @brief base class for handling meshes
	 * @param Object options
	 */
        function MeshFilter( opts ){
	    opts || ( opts = Class.OBJECT );
	    
            Component.call( this, "MeshFilter");
	    
	    /**
	    * @property Boolean castShadows
	    * @memberof MeshFilter
	    */
	    this.castShadows = opts.castShadows !== undefined ? !!opts.castShadows : true;
	    
	    /**
	    * @property Boolean receiveShadows
	    * @memberof MeshFilter
	    */
	    this.receiveShadows = opts.receiveShadows !== undefined ? !!opts.receiveShadows : true;
	    
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
        
	Class.extend( MeshFilter, Component );
	
	
	MeshFilter.prototype.copy = function( other ){
	    
	    this.castShadows = other.castShadows;
	    this.receiveShadows = other.receiveShadows;
	    
	    this.mesh = other.mesh;
	    this.material.copy( other.material );
	    
	    return this;
	};
	
        
        return MeshFilter;
    }
);