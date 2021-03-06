if (typeof define !== "function") {
    var define = require("amdefine")(module);
}
define(
    function() {
        "use strict";


        var splitter = /\s*[\s,]\s*/,
            createShader;

        /**
        * @class Dom
        * @brief DOM helper functions
        */
        function Dom() {}

        /**
        * @method addEvent
        * @memberof Dom
        * @brief adds event to object
        * @param Object obj
        * @param String name
        * @param Function callback
        * @param Object ctx
        */
        Dom.prototype.addEvent = function(obj, name, callback, ctx) {
            var names = name.split(splitter),
                i,
                scope = ctx || obj,
                afn = function(e) {
                    e = e || window.event;

                    if (callback) {
                        callback.call(scope, e);
                    }
                };

            for (i = names.length; i--;) {
                name = names[i];

                if (obj.attachEvent) {
                    obj.attachEvent("on" + name, afn);
                } else {
                    obj.addEventListener(name, afn, false);
                }
            }
        };

        /**
        * @method removeEvent
        * @memberof Dom
        * @brief removes event from object
        * @param Object obj
        * @param String name
        * @param Function callback
        * @param Object ctx
        */
        Dom.prototype.removeEvent = function(obj, name, callback, ctx) {
            var names = name.split(splitter),
                i, il,
                scope = ctx || obj,
                afn = function(e) {
                    e = e || window.event;

                    if (callback) {
                        callback.call(scope, e);
                    }
                };

            for (i = 0, il = names.length; i < il; i++) {
                name = names[i];

                if (obj.detachEvent) {
                    obj.detachEvent("on" + name, afn);
                } else {
                    obj.removeEventListener(name, afn, false);
                }
            }
        };

        /**
        * @method addMeta
        * @memberof Dom
        * @brief adds meta data to header
        * @param String id
        * @param String name
        * @param String content
        */
        Dom.prototype.addMeta = function(id, name, content) {
            var meta = document.createElement("meta"),
                head = document.getElementsByTagName("head")[0];

            if (id) meta.id = id;
            if (name) meta.name = name;
            if (content) meta.content = content;

            head.insertBefore(meta, head.firstChild);
        };

        /**
        * @property Object audioContext
        * @memberof Dom
        * @brief audio context of dom
        */
        Dom.prototype.audioContext = function() {
            return (
                window.audioContext ||
                window.webkitAudioContext ||
                window.mozAudioContext ||
                window.oAudioContext ||
                window.msAudioContext
            );
        }();

        /**
        * @method requestAnimFrame
        * @memberof Dom
        * @brief request animation frame
        * @param Function callback
        */
        Dom.prototype.requestAnimationFrame = function() {
            var RATE = 1000 / 60,
                request = (
                    window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    window.oRequestAnimationFrame ||
                    window.msRequestAnimationFrame ||
                    function(callback, element) {

                        return window.setTimeout(callback, RATE);
                    }
                );

            return function(callback, element) {

                return request(callback, element);
            }
        }();

        /**
        * @method getWebGLContext
        * @memberof Dom
        * @brief gets webgl context from canvas
        * @param HTMLCanvasElement canvas
        * @param Object attributes
        */
        Dom.prototype.getWebGLContext = function() {
            var names = ["webgl", "webkit-3d", "moz-webgl", "experimental-webgl", "3d"],
                defaultAttributes = {
                    alpha: true,
                    antialias: true,
                    depth: true,
                    premulipliedAlpha: true,
                    preserveDrawingBuffer: false,
                    stencil: true
                };

            return function(canvas, attributes) {
                var key, gl, i;

                attributes || (attributes = {});

                for (key in defaultAttributes) {
                    if (typeof attributes[key] === "undefined") {
                        attributes[key] = defaultAttributes[key];
                    }
                }

                for (i = names.length; i--;) {
                    gl = canvas.getContext(names[i], attributes);

                    if (gl) break;
                }

                if (!gl) console.warn("Dom.getWebGLContext: could not get webgl context");

                return gl;
            };
        }();

        /**
        * @method createShader
        * @memberof Dom
        * @brief creates shader from string
        * @param WebGLRenderingContext gl
        * @param String source
        * @param Object type webgl shader type( gl.FRAGMENT_SHADER or gl.VERTEX_SHADER )
        */
        Dom.prototype.createShader = createShader = function(gl, source, type) {
            var shader = gl.createShader(type);

            gl.shaderSource(shader, source);
            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.warn("Dom.createShader: problem compiling shader " + gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return undefined;
            }

            return shader;
        };

        /**
        * @method createProgram
        * @memberof Dom
        * @brief creates program from vertex shader and fragment shader
        * @param WebGLRenderingContext gl
        * @param String vertex
        * @param String fragment
        */
        Dom.prototype.createProgram = function(gl, vertex, fragment) {
            var program = gl.createProgram(),
                shader;

            shader = createShader(gl, vertex, gl.VERTEX_SHADER);
            gl.attachShader(program, shader);
            gl.deleteShader(shader);

            shader = createShader(gl, fragment, gl.FRAGMENT_SHADER);
            gl.attachShader(program, shader);
            gl.deleteShader(shader);

            gl.linkProgram(program);
            gl.validateProgram(program);
            gl.useProgram(program);

            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.warn("Dom.createProgram: problem compiling Program " + gl.getProgramInfoLog(program));
                gl.deleteProgram(program);
                return undefined;
            }

            return program;
        };

        /**
        * @method parseUniformsAttributes
        * @memberof Dom
        * @brief get uniforms and attributes locations form a program's vertex and fragment shader saves them in passed objects
        * @param WebGLRenderingContext gl
        * @param WebGLProgram program
        * @param String vertexShader
        * @param String fragmentShader
        * @param Object attributes
        * @param Object uniforms
        */
        Dom.prototype.parseUniformsAttributes = function() {
            var regAttribute = /attribute\s+([a-z]+\s+)?([A-Za-z0-9]+)\s+([a-zA-Z_0-9]+)\s*(\[\s*(.+)\s*\])?/,
                regUniform = /uniform\s+([a-z]+\s+)?([A-Za-z0-9]+)\s+([a-zA-Z_0-9]+)\s*(\[\s*(.+)\s*\])?/;

            return function(gl, program, vertexShader, fragmentShader, attributes, uniforms) {
                var src = vertexShader + fragmentShader,
                    lines = src.split("\n"),
                    matchAttributes, matchUniforms,
                    name, length, line,
                    i, j;

                for (i = lines.length; i--;) {
                    line = lines[i];
                    matchAttributes = line.match(regAttribute);
                    matchUniforms = line.match(regUniform);

                    if (matchAttributes) {
                        name = matchAttributes[3];
                        attributes[name] = gl.getAttribLocation(program, name);
                    }
                    if (matchUniforms) {
                        name = matchUniforms[3];
                        length = parseInt(matchUniforms[5]);

                        if (length) {
                            uniforms[name] = [];

                            for (j = length; j--;) {
                                uniforms[name][j] = gl.getUniformLocation(program, name + "[" + j + "]");
                            }
                        } else {
                            uniforms[name] = gl.getUniformLocation(program, name);
                        }
                    }
                }
            };
        }();


        return new Dom;
    }
);
