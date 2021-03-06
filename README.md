Ares.js
=======

Node.js WebGL Javascript App Framework

[Examples](http://lonewolfgames.github.io/Ares.js/) - [Documentation](http://lonewolfgames.github.io/Ares.js/doc/)


## How to install with npm
```
// install the ares.js package
// npm package is not updated as much as the github repository
// right now it is better to download from github
$ sudo npm install ares -g
```


### App
a App Class is the base for everything in your app, also check documentation for ClientApp and ServerApp
```
var MyApp = new ClientApp({ /*options*/ }); // options effect Settings.js

// to renderer a game we need an active scene and a camera component that is within the scene
var camera = new GameObject({
    components: [
        new Transform,
        new Camera
    ]
});
var scene = new Scene;

//add camera to scene
scene.addGameObject( camera );

// then set App's scene and camera
// set scene first, because App.setCamera needs an active scene
MyApp.setScene( scene );
MyApp.setCamera( camera );
```

### Scenes
Scenes hold and manage GameObjects and their Components
```
var scene = new Scene({ /*options*/ });

//Scenes must be added to game, set as the active scene to be able to render that scene
game.addScene( scene );

//other options are
game.addScenes( scene1, scene2, scene3... );

//same as above
game.add( scene1, scene2, scene3... );

//then set game's active scene with App.setScene
game.setScene( scene );
```


### GameObjects
GameObjects are containers that hold Components
```
var player = new GameObject({
    components: [
        // every GameObject needs a Transform
        new Transform({
            position: new Vec3( 0, 0, 5 ),
            rotation: new Quat().rotate( 0, 0, Math.PI*0.5 )
        })
    ],
    tags: [
        "player"
    ]
});

//add to scene
scene.addGameObject( player );

//other options are
scene.addGameObjects( gameObject1, gameObject2, gameObject3... );

//same as above
scene.add( gameObject1, gameObject2, gameObject3... );
```


## Setting up a App Environment

```
// create ares environment, pass -s to create a server based environment
$ ares new MyApp
$ cd MyApp/
```
directory structure looks like
```
MyApp/
----assets/
----build/
----lib/
--------require.js
----src
--------ares/
------------"ares source files"
--------index.js
----build.js
----index.html
----package.json
----README.md
```

if server based ( -s passed )
```
// install npm packages
$ npm install

// a server.js file will have been created in the src folder, so to start the server
$ node src/server.js

// console should log this
    info  - socket.io started
App started at 127.0.0.1:3000
```