if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
define([
        "base/class",
        "base/time"
    ],
    function(Class, Time) {
        "use strict";
		

        /**
        * @class Client
        * @extends App
        * @brief class for managing clients
        * @param Object options
        */

        function Client(opts) {
            opts || (opts = Class.OBJECT);

            Class.call(this);
			
			/**
			* @property String id
			* @brief unique id of this client
			* @memberof Client
			*/
			this.id = opts.id;
			
			/**
			* @property Object socket
			* @brief reference to this client's socket
			* @memberof Client
			*/
			this.socket = opts.socket;
			
			/**
			* @property Device device
			* @brief clients device information
			* @memberof Client
			*/
			this.device = opts.device;
			
			/**
			* @property ServerApp app
			* @brief reference to server application
			* @memberof Client
			*/
			this.app = opts.app;
			
			/**
			* @property Scene scene
			* @brief clients active scene 
			* @memberof Client
			*/
			this.scene = undefined;
			
			/**
			* @property Camera camera
			* @brief clients active camera 
			* @memberof Client
			*/
			this.camera = undefined;
			
			/**
			* @property Object userData
			* @brief custom data for client
			* @memberof Client
			*/
			this.userData = {};
        }

        Class.extend(Client, Class);


        Client.prototype.init = function() {
			
        };


        return Client;
    }
);
