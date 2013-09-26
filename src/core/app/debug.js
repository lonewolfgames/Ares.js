if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define(
    function(){
        "use strict";
	
	
        /**
	 * @class Debug
	 * @brief debug information display
	 */
	function Debug(){
	    var div = document.createElement("div");
	    
	    div.style.cssText = [
		"z-index: 1000;",
		"position: absolute;",
		"left: 0px;",
		"top: 0px;",
		"margin: 0px;",
		"padding: 0 4px;",
		"color: #ddd;",
		"text-shadow: 1px 1px #333;",
		"-webkit-touch-callout: none;",
		"-webkit-user-select: none;",
		"-khtml-user-select: none;",
		"-moz-user-select: moz-none;",
		"-ms-user-select: none;",
		"user-select: none;"
	    ].join("\n");
	    
	    /**
	    * @property HTMLElement div
	    * @memberof Debug
	    */
	    this.div = div;
	    
	    /**
	    * @property Array elements
	    * @memberof Debug
	    */
	    this.elements = [];
	}
	
	
	Debug.prototype.init = function(){
	    
	    document.body.appendChild( this.div );
	    this.update();
	};
	
	
	Debug.prototype.destroy = function(){
	    
	    document.body.removeChild( this.div );
	};
	
	
	Debug.prototype.add = function( name, data, key ){
	    var element = document.createElement("p"),
		elementSpan = document.createElement("span"),
		info = {
		    name: name,
		    element: element,
		    span: elementSpan,
		    data: data,
		    key: key
		};
	    
	    element.innerHTML = name +": ";
	    element.style.padding = "2px 0px";
	    element.style.margin = "0px";
	    element.appendChild( elementSpan );
	    this.div.appendChild( element );
	    
	    this.elements.push( info );
	};
	
	
	Debug.prototype.remove = function( info ){
	    var elements = this.elements,
		index = elements.indexOf( info );
	    
	    if( index > -1 ){
		this.div.removeChild( info.element );
		elements.splice( index, 1 );
	    }
	};
	
	
	Debug.prototype.update = function(){
	    var elements = this.elements, element,
		value,
		i;
		
	    for( i = elements.length; i--; ){
		element = elements[i];
		if( !element ) this.remove( element );
		
		value = element.data[ element.key ];
		replaceText( element.span, ~~( value * 1000 ) * 0.001 );
	    }
	    
	    setTimeout( this.update.bind( this ), 500 );
	};
	
	
	var replaceText = (function(){
	    var dummy = document.createElement("div"),
		TEXT;
	    
	    dummy.innerHTML = "text";
	    TEXT = dummy.textContent === "text" ? "textContent" : "innerText";
	    
	    return function( elem, text ){
		elem[ TEXT ] = text;
	    };
	}());
	
	
	return new Debug;
    }
);