var requirejs = require("requirejs"),
	Ares = require("ares");
	
requirejs({
		baseUrl: __dirname +"/",
		nodeRequire: require
	},
	function(){
		var app = new Ares.ServerApp;
		
		app.init();
	}
);