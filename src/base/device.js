if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define(
    function(){
        "use strict";
	
	
	var userAgent = navigator.userAgent.toLowerCase(),
	    audio = new Audio,
	    video = document.createElement("video");
	
        /**
	 * @class Device
	 * @brief user device info
	 */
	function Device(){
	    
	    /**
	    * @property String userAgent
	    * @brief user agent, lower case string
	    * @memberof Device
	    */
	    this.userAgent = userAgent;
	    
	    /**
	    * @property Number pixelRatio
	    * @brief device pixel ratio
	    * @memberof Device
	    */
	    this.pixelRatio = window.devicePixelRatio || 1;
	    
	    /**
	    * @property Number invPixelRatio
	    * @brief inverse device pixel ratio
	    * @memberof Device
	    */
	    this.invPixelRatio = 1 / this.pixelRatio;
	    
	    /**
	    * @property String browser
	    * @brief browser name
	    * @memberof Device
	    */
	    this.browser = userAgent.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i)[1];
	    
	    /**
	    * @property Boolean touch
	    * @brief is touch device
	    * @memberof Device
	    */
	    this.touch = "ontouchstart" in window;
	    
	    /**
	    * @property Boolean mobile
	    * @brief is mobile device
	    * @memberof Device
	    */
	    this.mobile = /android|webos|iphone|ipad|ipod|blackberry/i.test( userAgent );
	    
	    /**
	    * @property Boolean webgl
	    * @brief does this device have webgl renderering
	    * @memberof Device
	    */
	    this.webgl = (function(){
		var canvas = document.createElement("canvas"),
		    names = ["webgl", "webkit-3d", "moz-webgl", "experimental-webgl", "3d"],
		    has, i;
		
		for( i = names.length; i--; ){
		    has = !!canvas.getContext( names[i] );
		    if( has ) break;
		}
		
		return has;
	    }());
	    
	    /**
	    * @property Boolean canvas
	    * @brief does this device have canvas renderering
	    * @memberof Device
	    */
	    this.canvas = (function(){
		var canvas = document.createElement("canvas"),
		    has = !!canvas.getContext("2d");
		
		return has;
	    }());
	    
	    /**
	    * @property Boolean gamepads
	    * @brief does this device support Gamepads
	    * @memberof Device
	    */
	    this.gamepads = !!navigator.getGamepads || !!navigator.webkitGetGamepads || !!navigator.webkitGamepads;
	    
	    /**
	    * @property Boolean audioMpeg
	    * @brief can play mpeg
	    * @memberof Device
	    */
	    this.audioMpeg = !!audio.canPlayType("audio/mpeg");
	    
	    /**
	    * @property Boolean audioMpeg
	    * @brief can play ogg
	    * @memberof Device
	    */
	    this.audioOgg = !!audio.canPlayType("audio/ogg");
	    
	    /**
	    * @property Boolean audioMp4
	    * @brief can play mp4
	    * @memberof Device
	    */
	    this.audioMp4 = !!audio.canPlayType("audio/mp4");
	    
	    /**
	    * @property Boolean videoWebm
	    * @brief can play video webm
	    * @memberof Device
	    */
	    this.videoWebm = !!video.canPlayType("video/webm");
	    
	    /**
	    * @property Boolean videoOgg
	    * @brief can play video ogg
	    * @memberof Device
	    */
	    this.videoOgg = !!video.canPlayType("video/ogg");
	    
	    /**
	    * @property Boolean videoMp4
	    * @brief can play video mp4
	    * @memberof Device
	    */
	    this.videoMp4 = !!video.canPlayType("video/mp4");
	}
	
	
	return new Device;
    }
);