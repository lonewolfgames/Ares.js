if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"core/gameobject",
	"core/components/component",
    ],
    function( Class, GameObject, Component ){
	"use strict";
	
	
	/**
	 * @class Scene
	 * @extends Class
	 * @brief base class for managing GameObjects
	 * @param Object options
	 */
	function Scene( opts ){
	    opts || ( opts = Class.OBJECT );
	    
	    Class.call( this );
	    
	    /**
	    * @property Number _serverId
	    * @memberof Scene
	    */
	    this._serverId = -1;
	    
	    /**
	    * @property String name
	    * @memberof Scene
	    */
	    this.name = opts.name !== undefined ? opts.name : "Scene-"+ this._id;
	    
	    /**
	    * @property App app
	    * @memberof Scene
	    */
	    this.app = undefined;
	    
	    /**
	    * @property Array gameObjects
	    * @memberof Scene
	    */
	    this.gameObjects = [];
	    this._gameObjectHash = {};
	    this._gameObjectHashServer = {};
	    this._gameObjectNameHash = {};
	    
	    /**
	    * @property Array components
	    * @memberof Scene
	    */
	    this.components = {};
	    this._componentHash = {};
	    this._componentHashServer = {};
	    
	    if( opts.gameObjects ) this.addGameObjects.apply( this, opts.gameObjects );
	}
        
	Class.extend( Scene, Class );
	
	
	Scene.prototype.copy = function( other ){
	    var gameObjects = other.gameObjects,
		i;
	    
	    this.destroy();
	    
	    for( i = gameObjects.length; i--; ) this.addGameObject( gameObjects[i].clone() );
	    
	    if( other.app ) other.app.addScene( this );
	    
	    return this;
	};
        
	/**
	 * @method init
	 * @memberof Scene
	 * @brief inits all GameObjects attached to Scene
	 */
        Scene.prototype.init = function(){
	    var gameObjects = this.gameObjects,
		components = this.components, type,
		key, i;
	    
	    for( key in components ){
		type = components[ key ];
		for( i = type.length; i--; ) type[i].init();
	    }
	    
	    for( i = gameObjects.length; i--; ) gameObjects[i].emit("init");
	    
	    this.emit("init");
	};
        
	/**
	 * @method update
	 * @memberof Scene
	 * @brief updates all Components attached to Scene
	 */
        Scene.prototype.update = function(){
	    var gameObjects = this.gameObjects,
		components = this.components, type,
		key, i;
	    
	    for( key in components ){
		type = components[ key ];
		for( i = type.length; i--; ) type[i].update();
	    }
	    
	    for( i = gameObjects.length; i--; ) gameObjects[i].emit("update");
	    
	    this.emit("update");
	};
	
	/**
	 * @method clear
	 * @memberof Scene
	 * @brief clears Scene
	 * @return this
	 */
	Scene.prototype.clear = function(){
	    var gameObjects = this.gameObjects,
		i;
	    
	    for( i = gameObjects.length; i--; ) this.removeGameObject( gameObjects[i] );
	    
	    return this;
	};
	
	/**
	 * @method destroy
	 * @memberof Scene
	 * @brief destroys Scene and all GameObjects
	 * @return this
	 */
	Scene.prototype.destroy = function(){
	    if( !this.app ){
		console.warn("Scene.destroy: can\'t destroy Scene if it\'s not added to an App");
		return this;
	    }
	    var gameObjects = this.gameObjects,
		i;
	    
	    this.app.removeScene( this );
	    
	    for( i = gameObjects.length; i--; ) gameObjects[i].destroy();
	    
	    this.emit("destroy");
	    
	    return this;
	};
	
	/**
	 * @method addGameObject
	 * @memberof Scene
	 * @brief adds GameObject to Scene
	 * @param GameObject gameObject
	 * @return this
	 */
        Scene.prototype.addGameObject = function( gameObject ){
	    if( !( gameObject instanceof GameObject ) ){
		console.warn("Scene.addGameObject: can\'t add passed argument, it is not instance of GameObject");
		return this;
	    }
	    var gameObjects = this.gameObjects,
		index = gameObjects.indexOf( gameObject ),
		components = this.components, component, comps,
		key;
	    
	    if( index === -1 ){
		if( gameObject.scene ) gameObject.scene.removeGameObject( gameObject );
		
		gameObject.scene = this;
		gameObjects.push( gameObject );
		
		this._gameObjectHash[ gameObject._id ] = gameObject;
		if( gameObject._serverId !== -1 ) this._gameObjectHashServer[ gameObject._serverId ] = gameObject;
		
		this._gameObjectNameHash[ gameObject.name ] = gameObject;
		
		comps = gameObject.components;
		for( key in comps ){
		    component = comps[ key ];
		    if( !component ) continue;
		    
		    this._addComponent( component );
		}
		
		if( this.app ) gameObject.emit("init");
		
		this.emit("addGameObject", gameObject );
	    }
	    else{
		console.warn("Scene.addGameObject: GameObject is already a member of this");
	    }
	    
	    return this;
	};
        
	/**
	 * @method addGameObjects
	 * @memberof Scene
	 * @brief adds all GameObjects in arguments to Scene
	 * @return this
	 */
        Scene.prototype.addGameObjects = function(){
	    
	    for( var i = arguments.length; i--; ) this.addGameObject( arguments[i] );
	    
	    return this;
	};
        
	/**
	 * @method add
	 * @memberof Scene
	 * @brief same as addGameObjects
	 */
        Scene.prototype.add = Scene.prototype.addGameObjects;
        
	/**
	 * @method removeGameObject
	 * @memberof Scene
	 * @brief removes GameObject from Scene
	 * @param GameObject gameObject
	 * @return this
	 */
        Scene.prototype.removeGameObject = function( gameObject ){
	    if( !( gameObject instanceof GameObject ) ){
		console.warn("Scene.removeGameObject: can\'t remove passed argument, it is not instance of GameObject");
		return this;
	    }
	    var gameObjects = this.gameObjects,
		index = gameObjects.indexOf( gameObject ),
		components = this.components, component, comps,
		key;
	    
	    if( index !== -1 ){
		
		gameObject.scene = undefined;
		gameObjects.splice( index, 1 );
		
		this._gameObjectHash[ gameObject._id ] = undefined;
		if( gameObject._serverId !== -1 ) this._gameObjectHashServer[ gameObject._serverId ] = undefined;
		
		this._gameObjectNameHash[ gameObject.name ] = undefined;
		
		comps = gameObject.components;
		for( key in comps ){
		    component = comps[ key ];
		    if( !component ) continue;
		    
		    this._removeComponent( component );
		}
		
		this.emit("removeGameObject", gameObject );
	    }
	    else{
		console.warn("Scene.removeGameObject: GameObject is not a member of this");
	    }
	    
	    return this;
	};
        
	/**
	 * @method removeGameObjects
	 * @memberof Scene
	 * @brief removes all GameObjects in arguments from Scene
	 * @return this
	 */
        Scene.prototype.removeGameObjects = function(){
	    
	    for( var i = arguments.length; i--; ) this.removeGameObject( arguments[i] );
	    
	    return this;
	};
        
	/**
	 * @method remove
	 * @memberof Scene
	 * @brief same as removeGameObjects
	 */
        Scene.prototype.remove = Scene.prototype.removeGameObjects;
        
	
        Scene.prototype._addComponent = function( component ){
	    if( !component ) return;
	    var type = component._type,
		components = this.components,
		types = ( components[ type ] = components[ type ] || [] );
	    
	    this._componentHash[ component._id ] = component;
	    if( component._serverId !== -1 ) this._componentHashServer[ component._serverId ] = component;
	    
	    types.push( component );
	    types.sort( component.sort );
	    
	    this.emit( "add"+ type, component );
	    
	    if( this.app ) component.init();
	};
        
	
        Scene.prototype._removeComponent = function( component ){
	    if( !component ) return;
	    var type = component._type,
		components = this.components,
		types = components[ type ],
		index = types.indexOf( component );
	    
	    this._componentHash[ component._id ] = undefined;
	    if( component._serverId !== -1 ) this._componentHashServer[ component._serverId ] = undefined;
	    
	    types.splice( index, 1 );
	    types.sort( component.sort );
	    
	    this.emit( "remove"+ type, component );
	};
        
	/**
	 * @method getGameObjectByName
	 * @memberof Scene
	 * @brief returns GameObject by name
	 * @param String name
	 * @return GameObject
	 */
        Scene.prototype.getGameObjectByName = function( name ){
	    
	    return this._gameObjectNameHash[ name ];
	};
        
	/**
	 * @method getGameObjectById
	 * @memberof Scene
	 * @brief returns GameObject by id
	 * @param Number id
	 * @return GameObject
	 */
        Scene.prototype.getGameObjectById = function( id ){
	    
	    return this._gameObjectHash[ id ];
	};
        
	/**
	 * @method getGameObjectByServerId
	 * @memberof Scene
	 * @brief returns GameObject by server id
	 * @param Number id
	 * @return GameObject
	 */
        Scene.prototype.getGameObjectByServerId = function( id ){
	    
	    return this._gameObjectHashServer[ id ];
	};
        
	/**
	 * @method getComponentById
	 * @memberof Scene
	 * @brief returns Component by id
	 * @param Number id
	 * @return Component
	 */
        Scene.prototype.getComponentById = function( id ){
	    
	    return this._componentHash[ id ];
	};
        
	/**
	 * @method getComponentByServerId
	 * @memberof Scene
	 * @brief returns Component by server id
	 * @param Number id
	 * @return Component
	 */
        Scene.prototype.getComponentByServerId = function( id ){
	    
	    return this._componentHashServer[ id ];
	};
	
	
	return Scene;
    }
);