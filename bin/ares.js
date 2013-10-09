#!/usr/bin/env node

var ares = require("commander"),
    mkdirp = require("mkdirp"),
    ncp = require("ncp").ncp,
    fs = require("fs"),
    pkg = require("../package.json"),
    version = pkg.version,
	cwd = process.cwd();

ares.version(version);
ares.option("-s, --server", "use with new to create server based game");

ares.command("new <name>").description("creates new app environment").action(function(name) {
    var path = cwd + "/" + name + "/",
		lowerCaseName = name.toLowerCase();

    console.log("");
    console.log("Creating Environment in " + path);
    console.log("");

    mkdir(path, function() {

        mkdir(path + "build");
        mkdir(path + "assets");

        mkdir(path + "src", function() {

            console.log("....coping ares source to " + path + "src/ares");
            ncp(__dirname + "/../src/", path + "src/", function(error) {
                if (error) throw error;

                if (ares.server) {
                    write(path + "src/server.js", server_js);
                    write(path + "src/index.js", client_js);
                } else {
                    write(path + "src/index.js", index_js);
                }
            });
        });

        mkdir(path + "lib", function() {

            console.log("....coping require.js to " + path + "lib/require.js");
            ncp(__dirname + "/../examples/require.js", path + "lib/require.js", function(error) {
                if (error) throw error;
            });
        });

        if (ares.server) {
            write(path + "index.html", client_html(name));
        } else {
            write(path + "index.html", index_html(name));
        }

        write(path + "package.json", package_json(lowerCaseName));
        write(path + "README.md", README_md(name));
        write(path + "build.js", build_js);
    });
});


ares.command("update").description("updates ares source").action(function() {
    var aresSrc = cwd + "/src/";
	
    stats = fs.lstatSync(aresSrc);

    if (stats.isDirectory()) {
        console.log("");
        console.log("Updatind Ares Source in " + cwd);
        console.log("");

        ncp(__dirname + "/../src", aresSrc, function(error) {
            if (error) throw error;
        });
    } else {
        throw "    could not find ares src, make sure your in the root of your project";
    }
});


function mkdir(path, fn) {

    console.log("....creating directory "+ path);
    mkdirp(path, "755", function(error) {
        if (error) throw error;
        fn && fn();
    });
}


function write(path, str) {

    console.log("....creating file " + path);
    fs.writeFile(path, str);
}

var package_json = function(name) {
	
	return [
		'{',
		'    "name": "'+ name +'",',
		'    "version": "0.0.1",',
		'    "readmeFilename": "README.md",',
		'    "license": "BSD",',
		'    "dependencies": {',
		'        "requirejs": "~2.1.5",',
		'        "ares": "~' + version + '"',
		'    }',
		'}'
	].join("\n");
};

var README_md = function(name) {
	
	return [
		name +'.js',
		'=======',
		'',
		'WebGL Javascript Game'
	].join("\n");
};

var build_js = [
    '({',
    '    include: "./../lib/require.js",',
    '    ',
    '    baseUrl: "./src/",',
    '    name: "index",',
    '    ',
    '    optimize: "uglify2",',
    '    uglify2: {',
    '        output: {',
    '            beautify: false',
    '        },',
    '        compress: {',
    '            dead_code: true,',
    '            unused: true,',
    '            sequences: true,',
    '            conditionals: true',
    '        },',
    '        warnings: true,',
    '        mangle: false',
    '    },',
    '    ',
    '    out: "./build/index.js"',
    '})'
].join("\n");

var index_js = [
    'require(',
    '    {',
    '        baseUrl: "./src",',
    '    },',
    '    [',
    '        "ares",',
    '    ],',
    '    function( Ares ){',
    '        ',
    '        var app = new Ares.ClientApp({',
    '            debug: true',
    '        });',
    '        ',
    '        app.on("init", function(){',
    '            // Client Game goes here',
    '        });',
    '        ',
    '        app.init();',
    '    }',
    ');'
].join("\n");

var client_js = [
    'require(',
    '    {',
    '        baseUrl: "./src",',
    '    },',
    '    [',
    '        "ares",',
    '    ],',
    '    function( Ares ){',
    '        ',
    '        var app = new Ares.ClientGame({',
    '            debug: true,',
    '            host: "127.0.0.1",',
    '            port: 3000',
    '        });',
    '        ',
    '        app.on("init", function(){',
    '            // Client Game goes here',
    '            this.connect();',
    '        });',
    '        ',
    '        app.on("connect", function(){',
    '            // Client Game after connecting to server goes here',
    '        });',
    '        ',
    '        app.init();',
    '    }',
    ');'
].join("\n");

var server_js = [
    'var requirejs = require("requirejs"),',
    '    Ares = require("ares");',
    '',
    'requirejs(',
    '    {',
    '        baseUrl: __dirname +"/",',
    '        nodeRequire: require',
    '    },',
    '    function(){',
    '        ',
    '        var app = new Ares.ServerApp({',
    '            debug: true,',
    '            host: "127.0.0.1",',
    '            port: 3000',
    '        });',
    '        ',
    '        app.on("init", function(){',
    '            // Server Game goes here',
    '        });',
    '        ',
    '        app.init();',
    '    }',
    ');'
].join("\n");

var index_html = function(name) {
	
	return [
		'<!DOCTYPE html>',
		'<html>',
		'    <head>',
		'        ',
		'        <meta charset="utf-8">',
		'        <meta http-equiv="X-UA-Compatible" content="IE=edge">',
		'        ',
		'        <meta name="apple-mobile-web-app-status-bar-style" content="black" />',
		'        <meta name="apple-mobile-web-app-capable" content="yes" />',
		'        ',
		'        <meta name="description" content="">',
		'        <meta name="keywords" content="'+ name.toLowerCase() +', '+ name +', ares.js, ares, game, html5, canvas, webgl">',
		'        ',
		'        <title>'+ name +'</title>',
		'        ',
		'        <script type="text/javascript" data-main="./src/index.js" src="lib/require.js"></script>',
		'        ',
		'    </head>',
		'    ',
		'    <body></body>',
		'    ',
		'</html>',
	].join("\n");
};

var client_html = function(name) {
	
	return [
		'<!DOCTYPE html>',
		'<html>',
		'    <head>',
		'        ',
		'        <meta charset="utf-8">',
		'        <meta http-equiv="X-UA-Compatible" content="IE=edge">',
		'        ',
		'        <meta name="apple-mobile-web-app-status-bar-style" content="black" />',
		'        <meta name="apple-mobile-web-app-capable" content="yes" />',
		'        ',
		'        <meta name="description" content="">',
		'        <meta name="keywords" content="ares.js, ares, game, html5, canvas, webgl">',
		'        ',
		'        <title>'+ name +'</title>',
		'        ',
		'        <script type="text/javascript" src="/socket.io/socket.io.js"></script>',
		'        ',
		'        <script type="text/javascript" src="./lib/require.js"></script>',
		'        <script type="text/javascript" data-main="./src/index.js" src="lib/require.js"></script>',
		'        ',
		'    </head>',
		'    ',
		'    <body></body>',
		'    ',
		'</html>',
	].join("\n");
};

ares.parse(process.argv);
module.exports = ares;
