if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/time"
    ],
    function(  Time ){
	"use strict";
	
	
        function Button(){
	    
	    this.timeDown = -1;
	    this.timeUp = -1;
	    
	    this.frameDown = -1;
	    this.frameUp = -1;
	    
	    this.value = false;
	    this._first = true;
        };
	
	
        function Buttons(){
	    
	    this.list = {
		"mouse0": new Button,
		"mouse1": new Button,
		"mouse2": new Button
	    };
        };
	
	
	Buttons.prototype.on = function( name ){
	    this.list[ name ] || ( this.list[ name ] = new Button );
	    var button = this.list[ name ];
	    
	    if( !button ) return;
	    
	    if( button._first ){
		button.frameDown = Time.frameCount + 1;
		button.timeDown = Time.stamp();
		button._first = false;
	    }
	    button.value = true;
	};
	
	
	Buttons.prototype.off = function( name ){
	    var button = this.list[ name ];
	    
	    if( !button ) return;
	    
	    button.frameUp = Time.frameCount + 1;
	    button.timeUp = Time.stamp();
	    button._first = true;
	    button.value = false;
	};
        
        
        return new Buttons;
    }
);