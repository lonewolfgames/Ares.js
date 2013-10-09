if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
define([
		"require",
        "base/class",
        "base/time",
        "core/app/app",
        "core/app/client",
        "core/app/loop",
        "core/app/mime",
        "core/app/settings",
        "core/assets/assets"
    ],
    function(require, Class, Time, App, Client, Loop, Mime, Settings, Assets) {
        "use strict";


        var http = require("http"),
			path = require("path"),
			fs = require("fs"),
			io = require("socket.io"),
			
			now = Time.now,
            MIN_DELTA = 0.00001,
            MAX_DELTA = 0.5;
		
        /**
        * @class ServerApp
        * @extends App
        * @brief class for managing server application
        * @param Object options
        */

        function ServerApp(opts) {
            opts || (opts = Class.OBJECT);

            App.call(this);
            Settings.fromJSON(opts);

            this._loop = new Loop(loop, this);
			
			/**
            * @property Array clients
            * @memberof ServerApp
            */
			this.clients = {};
			
			/**
			* @property http.Server server
			* @brief reference to http server
			* @memberof ServerGame
			*/
			this.server = new http.Server( handleRequest.bind( this ) );
			this.server.listen( Settings.port, Settings.host );
			
			/**
			* @property Object io
			* @brief reference to socket.io
			* @memberof ServerGame
			*/
			this.io = io.listen( this.server );
			
			var scope = this;
	
			this.io.configure(function(){
				scope.io.set("log level", ( Settings.debug ? 2 : 0 ) );
			});
        }

        Class.extend(ServerApp, App);


        ServerApp.prototype.init = function() {
			var scope = this;
			
			this.io.on("connection", function(socket) {
				var clients = scope.clients,
					id = socket.id,
					client,
					i;
				
				socket.on("error", function() {
					scope.emit("error", id);
					console.log("ServerGame: Client id: "+ id +" disconnected with errors");
					if( clients[ id ] ) clients[ id ] = undefined;
				});
				
				socket.on("disconnect", function() {
					scope.emit("disconnect", id);
					console.log("ServerGame: Client id: "+ id +" disconnected");
					if( clients[ id ] ) clients[ id ] = undefined;
				});
		
				socket.emit("server_connection", id, Assets );
				
				socket.on("client_connect", function(device) {
					client = clients[id] = new Client({
						id: id,
						socket: socket,
						device: device,
						app: scope
					});
					
					console.log(
					"\nServerGame: new client connected\n"+
					"    id: "+ id  +"\n"+
					"    browser: "+ device.browser  +"\n"+
					"    mobile: "+ ( device.mobile ? "true" : "false" ) +"\n"+
					"    canvas: "+ ( device.canvas ? "true" : "false" ) +"\n"+
					"    webgl: "+ ( device.webgl ? "true" : "false" ) +"\n"
					);

				});
			});
			
			this._loop.resume();
            this.emit("init");
			
			console.log("Server App started at "+ Settings.host +":"+ Settings.port );
        };

        /**
        * @method suspend
        * @memberof ServerApp
        * @brief suspends game loop
        */
        ServerApp.prototype.suspend = function() {

            this._loop.suspend();
            return this;
        };

        /**
        * @method resume
        * @memberof ServerApp
        * @brief resumes game loop
        */
        ServerApp.prototype.resume = function() {

            this._loop.resume();
            return this;
        };

        /**
        * @method isStarted
        * @memberof ServerApp
        * @return Boolean
        */
        ServerApp.prototype.isStarted = function() {

            return this._loop.isStarted();
        };
		

        var frameCount = 0,
            last = -1 / 60,
            time = 0,
            delta = 1 / 60,
            fpsFrame = 0,
            fpsLast = 0,
            fpsTime = 0,
			lastSceneSync = 0;

        function loop(ms) {
            var sockets = this.io.sockets,
				clients = this.clients,
				scenes = this.scenes,
				needsSceneSync = false,
				client,
				i;

            Time.frameCount = frameCount++;

            last = time;
            time = now();
            Time.sinceStart = time;

            fpsTime = time;
            fpsFrame++;

            if (fpsLast + 1 < fpsTime) {
                Time.fps = fpsFrame / (fpsTime - fpsLast);

                fpsLast = fpsTime;
                fpsFrame = 0;
            }

            delta = (time - last) * Time.scale;
            Time.delta = delta < MIN_DELTA ? MIN_DELTA : delta > MAX_DELTA ? MAX_DELTA : delta;

            Time.time = time * Time.scale;
			
			lastSceneSync += delta;
			
			if( needsSceneSync > 0.1 ){
				lastSceneSync = 0;
				needsSceneSync = true;
			}

            for( i in clients ){
				client = clients[i];
				
				//if( client.scene ){}
				
				//clients[i].update();
			}

            for( i = scenes.length; i--; ) scenes[i].update();
			
            this.emit("update", time);
        }
		
		
		var CONTENT_TYPE = "Content-Type",
			TEXT_HTML = "text/html",
			INDEX_HTML = "index.html",
			NOT_FOUND = "404 Not Found"
			
		function handleRequest( req, res ){
			var uri = req.url,
				fileName = path.join(process.cwd(), uri),
				ext = path.extname(fileName).replace(".",""),
				mimeType = Mime.lookUp(ext);
			
			fs.exists(fileName, function(exists) {
				if (!exists) {
					res.statusCode = 404;
					res.setHeader(CONTENT_TYPE, TEXT_HTML);
					res.write(NOT_FOUND);
					res.end();
					return;
				}
				
				if( fs.statSync( fileName ).isDirectory() ){
					fileName += INDEX_HTML;
					mimeType = TEXT_HTML;
				}
				
				fs.readFile( fileName, function( error, file ){
		
					if (error) {
						res.statusCode = 500;
						res.setHeader(CONTENT_TYPE, TEXT_HTML);
						res.write(err);
						res.end();
						return;
					}

					res.statusCode = 200;
					res.setHeader(CONTENT_TYPE, mimeType);
					res.write(file, mimeType);
					res.end();
				});
			});
		}


        return ServerApp;
    }
);