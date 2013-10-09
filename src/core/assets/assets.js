if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
define([
        "base/class",
        "core/assets/asset",
        "core/app/settings"
    ],
    function(Class, Asset, Settings) {
        "use strict";


        var LOAD = {},
            TO_JSON = {},
            BROWSER = typeof(window) !== "undefined";

        /**
        * @class Assets
        * @extends Class
        * @brief class for manageing assets
        */

        function Assets() {

            Class.call(this);

            /**
            * @property Boolean loading
            * @memberof Assets
            */
            this.loading = false;

            this._assets = {};
            this._queue = {};
            this._queued = 0;
        }

        Class.extend(Assets, Class);

        /**
        * @method get
        * @memberof Assets
        * @brief returns Asset by name
        * @param Asset asset
        * @param Function callback
        */
        Assets.prototype.get = function(name) {

            return this._assets[name] || this._queue[name];
        };

        /**
        * @method addAssets
        * @memberof Assets
        * @brief adds all Assets in arguments to this, make sure passed is name, src, name, src....
        */
        Assets.prototype.addAssets = function() {
            var name, src,
                i, il = arguments.length;

            for (i = 0; i < il; i += 2) {
                name = arguments[i];
                src = arguments[i + 1];

                if ((!name || typeof(name) !== "string") || !src || typeof(src) !== "string") {
                    console.warn("Assets.addAssets: argument passed at " + i + " was invalid");
                    continue;
                }

                this.addAsset(name, src, true);
            }
        };

        /**
        * @method addAsset
        * @memberof Assets
        * @brief adds a new Asset with name and src to this
        * @param String name
        * @param String src
        */
        Assets.prototype.addAsset = function(name, src) {
            var queue = this._queue,
                assets = this._assets,
                asset,
                queueIndex = queue[name],
                index = assets[name];

            if (!queueIndex && !index) {
                this._queued++;

                queue[name] = asset = new Asset(name, src);
                if (BROWSER) load.call(this, asset);
            } else {
                console.warn("Assets.addAsset: already has a assets with name " + name);
            }
        };

        /**
        * @method add
        * @memberof Assets
        * @brief same as Assets.addAssets
        */
        Assets.prototype.add = Assets.prototype.addAssets;

        /**
        * @method fromJSON
        * @memberof Assets
        * @brief sets values from json object
        * @returns this
        */
        Assets.prototype.fromJSON = function(json) {
            var assets = this._assets,
                asset, jsonAsset,
                key;

            for (key in assets) {
                asset = json[key];

                jsonAsset = new Asset(key, "");
                jsonAsset.data = asset;

                assets[key] = jsonAsset;
            }

            return this;
        };

        /**
        * @method toJSON
        * @memberof Assets
        * @brief returns json object
        * @returns Object
        */
        Assets.prototype.toJSON = function() {
            var json = {},
                assets = this._assets,
                asset,
                key;

            for (key in assets) {
                asset = assets[key];

                try {
                    json[key] = TO_JSON[asset.ext].call(asset);
                } catch (error) {
                    console.log("Assets.pack: failed to convert " + key + " to JSON with error: " + error);
                }
            }

            return json;
        };


        function load(asset) {
            var scope = this,
                name = asset.name,
                ext = (asset.src.split(".").pop()).toLowerCase(),
                EXT = ext.toUpperCase(),
                loadFn = LOAD[ext];

            this.loading = true;
            if (Settings.debug) console.log("Assets: loading " + name + " form " + asset.src);

            try {
                asset.ext = ext;

                loadFn.call(asset, function(error) {

                    if (!error) {
                        scope._assets[name] = asset;
                        scope.emit("load" + EXT, asset);
                    } else {
                        console.warn("Assets load: failed to load " + name + " with error: " + error);
                    }

                    delete scope._queue[name];
                    scope._queued--;

                    if (scope._queued <= 0) {
                        scope._queued = 0;

                        scope.loading = false;
                        scope.emit("loadAll");
                    }
                });
            } catch (error) {
                console.warn('Assets load: no function for extension .' + ext + ' add using Assets.LOAD["' + ext + '"]');
                delete scope._queue[name];
                scope._queued--;

                asset.ext = ext;

                if (scope._queued <= 0) {
                    scope._queued = 0;

                    scope.loading = false;
                    scope.emit("loadAll");
                }
            }
        };


        LOAD["jpeg"] = LOAD["jpg"] = LOAD["png"] = function(callback) {
            var scope = this,
                image = new Image;

            image.onload = function() {
                scope.data = image;
                callback();
            };
            image.onerror = function(error) {
                callback(error);
            };

            image.src = this.src;
        };


        LOAD["json"] = function(callback) {
            var scope = this,
                request = new XMLHttpRequest;

            request.onreadystatechange = function(e) {

                if (this.readyState === 1) {
                    this.send(undefined);
                } else if (this.readyState === 4) {
                    var status = this.status;

                    if ((status > 199 && status < 301) || status === 304) {

                        scope.data = JSON.parse(this.responseText);
                        callback();
                    } else {
                        callback(status);
                    }
                }
            };

            request.open("GET", this.src, true);
        };


        Assets.prototype.LOAD = LOAD;


        var TO_JSON_CANVAS, TO_JSON_CTX;
        TO_JSON["jpeg"] = TO_JSON["jpg"] = TO_JSON["png"] = function() {
            var image = this.data,
                canvas = TO_JSON_CANVAS || (TO_JSON_CANVAS = document.createElement("canvas")),
                ctx = TO_JSON_CTX || (TO_JSON_CTX = TO_JSON_CANVAS.getContext("2d")),
                ext = this.ext === "jpg" ? "jpeg" : this.ext,
                dataURL;

            canvas.width = image.width;
            canvas.height = image.height;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0);

            return canvas.toDataURL("image/" + ext);
        };


        TO_JSON["json"] = function() {
            var json = {},
                obj = this.data,
                key;

            for (key in obj) {
                if (obj.hasOwnProperty(key)) json[key] = obj[key];
            }

            return json;
        };


        Assets.prototype.TO_JSON = TO_JSON;


        return new Assets;
    }
);
