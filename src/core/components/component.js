if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class"
    ],
    function( Class ){
	"use strict";
	
	/**
	 * @class Component
	 * @extends Class
	 * @brief base class for all components
	 * @param String type
	 */
	function Component( type ){
	    
	    Class.call( this );
	    
	    /**
	    * @property Number _serverId
	    * @memberof GameObject
	    */
	    this._serverId = -1;
	    
	    /**
	    * @property String type
	    * @memberof Component
	    */
	    this._type = type;
	    
	    /**
	    * @property GameObject gameObject
	    * @memberof Component
	    */
	    this.gameObject = undefined;
	    
	    this.camera = undefined;
	    this.emitter = undefined;
	    this.meshfilter = undefined;
	    this.script = undefined;
	    this.transform = undefined;
	}
        
	Class.extend( Component, Class );
        
	
        Component.prototype.init = function(){
	    
        };
        
	
        Component.prototype.update = function(){
	    
        };
        
	
        Component.prototype.clear = function(){
	    
        };
        
	
        Component.prototype.destroy = function(){
	    if( !this.gameObject ){
		console.warn("Component.destroy: can\'t destroy Component if it\'s not added to a GameObject");
		return this;
	    }
	    
	    this.gameObject.removeComponent( this );
	    this.emit("destroy");
	    
	    return this;
	};
	
	
	Component.prototype.sort = function( a, b ){
	    
	    return a === b ? -1 : 1;
	};
	
	
	return Component;
    }
);