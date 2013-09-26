require(
    {
	baseUrl: "../../src/"
    },
    [
	"ares"
    ],
    function( Ares ){
	
	Ares.globalize();
	
	
	var abs = Math.abs,
	    sign = Mathf.sign,
	    PI = Math.PI;
	
	function Player( opts ){
	    opts || ( opts = Class.OBJECT );
	    
	    Script.call( this, "Player" );
	    
	    this.speed = opts.speed > 0 ? opts.speed : 5;
	    
	    this._velocity = new Vec3;
	    this._x = 0;
	}
        
	Class.extend( Player, Script );
	
	Player.prototype.onInit = function(){
	    
	};
	
	Player.prototype.onUpdate = function(){
	    var transform = this.transform,
		animation = this.animation,
		x = this.speed * Input.axis("horizontal"),
		vel = this._velocity;
	    
	    if( x ){
		animation.play("run", 2 );
		vel.y += x;
		
		if( x < 0 ){
		    transform.rotation.z = 1;
		    transform.rotation.w = 0;
		}
		else{
		    transform.rotation.z = 0;
		    transform.rotation.w = -1;
		}
		
		animation.rate = abs(1/(x*5));
	    }
	    else{
		animation.rate = 0.2;
		animation.play("idle", 2 );
	    }
	    
	    this._x = x;
	    
	    vel.smul( Time.delta );
	    transform.position.add( vel );
	};
	
	app = new ClientApp({
	    debug: true
	});
	
	Assets.add(
	    "img_deus", "../content/images/deus.jpg",
	    "mesh_deus", "../content/geometry/deus.json"
	);
	
	Assets.once("loadAll", function(){
	    scene = new Scene;
	    
	    deus = new Mesh({
		data: Assets.get("mesh_deus").data
	    });
	    
	    box = new Mesh.Cube;
	    
	    camera = new GameObject({
		components: [
		    new Transform({
			position: new Vec3( 0, -5, 0)
		    }),
		    new Camera,
		    new OrbitCamera
		]
	    });
	    
	    player = new GameObject({
		components: [
		    new Transform({
			position: new Vec3( 0, 0, -0.9 )
		    }),
		    new MeshFilter({
			mesh: deus,
			material: new Material({
			    mainTexture: new Texture({
				image: Assets.get("img_deus")
			    })
			})
		    }),
		    new Animation({
			rate: 1/24
		    }),
		    new Player
		]
	    });
	    sword = new GameObject({
		components: [
		    new Transform({
			position: new Vec3( 0, 0, 0 ),
			scale: new Vec3( 0.1, 0.1, 1 )
		    }),
		    new MeshFilter({
			mesh: box,
			material: new Material({
			    mainTexture: new Texture({
				image: Assets.get("img_deus")
			    })
			})
		    })
		]
	    });
	    player.on("init", function(){
		
		sword.transform.parent = this.animation.getBone("r_weapon");
	    });
	    
	    ground = new GameObject({
		components: [
		    new Transform({
			position: new Vec3( 0, 0, -0.95 ),
			scale: new Vec3( 5, 5, 0.1 )
		    }),
		    new MeshFilter({
			mesh: box,
			material: new Material({
			    mainTexture: new Texture({
				image: Assets.get("img_deus")
			    })
			})
		    })
		]
	    });
	    
	    scene.addGameObjects( sword, camera, player, ground );
	    
	    app.addScene( scene );
	    app.setScene( scene );
	    app.setCamera( camera );
	});
	
	app.init();
    }
);