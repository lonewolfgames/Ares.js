if( typeof define !== "function" ){
    var define = require("amdefine")( module );
}
define([
	"base/class",
	"base/objectpool",
	"base/time",
	"math/mathf",
	"math/vec3",
	"math/color",
	"core/components/component"
    ],
    function( Class, ObjectPool, Time, Mathf, Vec3, Color, Component ){
        "use strict";
	
	
	var PI = Math.PI,
	    TWO_PI = PI * 2,
	    
	    sqrt = Math.sqrt,
	    random = Math.random,
	    randInt = Mathf.randInt,
	    randFloat = Mathf.randFloat,
	    clampTop = Mathf.clampTop,
	    
	    particlePool = Emitter.PARTICLE_POOL = new ObjectPool( Particle );
	
        /**
	 * @class Emitter
	 * @extends Component
	 * @brief 2d particle emitter
	 * @param Object options
	 */
        function Emitter( opts ){
	    opts || ( opts = Class.OBJECT );
	    
            Component.call( this, "Emitter");
	    
	    /**
	    * @property Boolean worldSpace
	    * @memberof Emitter
	    */
	    this.worldSpace = opts.worldSpace !== undefined ? opts.worldSpace : true;
	    
	    /**
	    * @property Number minEmission
	    * @memberof Emitter
	    */
	    this.minEmission = opts.minEmission !== undefined ? opts.minEmission : 1;
	    
	    /**
	    * @property Number maxEmission
	    * @memberof Emitter
	    */
	    this.maxEmission = opts.maxEmission !== undefined ? opts.maxEmission : 2;
	    
	    /**
	    * @property Number minLife
	    * @memberof Emitter
	    */
	    this.minLife = opts.minLife !== undefined ? opts.minLife : 1;
	    
	    /**
	    * @property Number maxLife
	    * @memberof Emitter
	    */
	    this.maxLife = opts.maxLife !== undefined ? opts.maxLife : 2;
	    
	    /**
	    * @property Number minSize
	    * @memberof Emitter
	    */
	    this.minSize = opts.minSize !== undefined ? opts.minSize : 0.1;
	    
	    /**
	    * @property Number maxSize
	    * @memberof Emitter
	    */
	    this.maxSize = opts.maxSize !== undefined ? opts.maxSize : 0.5;
	    
	    /**
	    * @property Vec3 angularVelocity
	    * @memberof Emitter
	    */
	    this.velocity = opts.velocity !== undefined ? opts.velocity : new Vec3( 0, 0, 0 );
	    
	    /**
	    * @property Vec3 randVelocity
	    * @memberof Emitter
	    */
	    this.randVelocity = opts.randVelocity !== undefined ? opts.randVelocity : new Vec3( 1, 1, 1 );
	    
	    /**
	    * @property Number angularVelocity
	    * @memberof Emitter
	    */
	    this.angularVelocity = opts.angularVelocity !== undefined ? opts.angularVelocity : 0;
	    
	    /**
	    * @property Number randAngularVelocity
	    * @memberof Emitter
	    */
	    this.randAngularVelocity = opts.randAngularVelocity !== undefined ? opts.randAngularVelocity : PI;
	    
	    /**
	    * @property Boolean randRotation
	    * @memberof Emitter
	    */
	    this.randRotation = opts.randRotation !== undefined ? opts.randRotation : true;
	    
	    /**
	    * @property Number emissionRate
	    * @memberof Emitter
	    */
	    this.emissionRate = opts.emissionRate !== undefined ? opts.emissionRate : 1/60;
	    
	    /**
	    * @property Color color
	    * @memberof Emitter
	    */
	    this.color = opts.color !== undefined ? opts.color : new Color;
	    
	    /**
	    * @property Color randColor
	    * @memberof Emitter
	    */
	    this.randColor = opts.randColor !== undefined ? opts.randColor : new Color;
	    
	    /**
	    * @property Number alphaStart
	    * @memberof Emitter
	    */
	    this.alphaStart = opts.alphaStart !== undefined ? opts.alphaStart : 0;
	    
	    /**
	    * @property Number time
	    * @memberof Emitter
	    */
	    this.time = opts.time !== undefined ? opts.time : 0;
	    this._time = 0;
	    
	    /**
	    * @property Number duration
	    * @memberof Emitter
	    */
	    this.duration = opts.duration !== undefined ? opts.duration : 0;
	    
	    /**
	    * @property Boolean loop
	    * @memberof Emitter
	    */
	    this.loop = opts.loop !== undefined ? opts.loop : true;
	    
	    /**
	    * @property Boolean playing
	    * @memberof Emitter
	    */
	    this.playing = opts.playing !== undefined ? opts.playing : true;
	    
	    /**
	    * @property Array particles
	    * @memberof Emitter
	    */
	    this.particles = [];
	}
        
	Class.extend( Emitter, Component );
	
	
	Emitter.prototype.copy = function( other ){
	    
	    this.worldSpace = other.worldSpace;
	    
	    this.minEmission = other.minEmission;
	    this.maxEmission = other.maxEmission;
	    
	    this.minLife = other.minLife;
	    this.maxLife = other.maxLife;
	    
	    this.minSize = other.minSize;
	    this.maxSize = other.maxSize;
	    
	    this.velocity.copy( other.velocity );
	    this.randVelocity.copy( other.randVelocity );
	    
	    this.angularVelocity = other.angularVelocity;
	    this.randAngularVelocity = other.randAngularVelocity;
	    this.randRotation = other.randRotation;
	    
	    this.emissionRate = other.emissionRate;
	    
	    this.color.copy( other.color );
	    this.randColor.copy( other.randColor );
	    
	    this.time = other.time;
	    this._time = other._time;
	    
	    this.duration = other.duration;
	    this.loop = other.loop;
	    this.playing = other.playing;
	    
	    return this;
	};
	
	/**
	 * @method play
	 * @memberof Emitter
	 */
	Emitter.prototype.play = function(){
	    if( this.playing ) return;
	    
	    this.time = 0;
	    this.playing = true;
	};
	
	/**
	 * @method spawn
	 * @memberof Emitter
	 * @brief spawns number of particles based on properties
	 * @param Number count
	 */
	Emitter.prototype.spawn = function( count ){
	    var transform = this.gameObject.transform2d, position = transform.position,
		particles = this.particles, numParticles = particles.length, particle,
		worldSpace = this.worldSpace,
		randRotation = this.randRotation,
		color = this.color, randColor = this.randColor, useRandColor = randColor.lengthSq() > 0,
		velocity = this.velocity, randVelocity = this.randVelocity,
		angularVelocity = this.angularVelocity, randAngularVelocity = this.randAngularVelocity,
		minLife = this.minLife, maxLife = this.maxLife,
		minSize = this.minSize, maxSize = this.maxSize,
		alphaStart = this.alphaStart,
		limit = clampTop( numParticles + count, Emitter.MAX_PARTICLES ) - numParticles,
		vel, pos, col,
		i;
	    
	    for( i = limit; i--; ){
		particle = particlePool.create();
		pos = particle.position;
		vel = particle.velocity;
		col = particle.color;
		
		col.r = color.r;
		col.g = color.g;
		col.b = color.b;
		
		if( useRandColor ){
		    col.r += randColor.r * random();
		    col.g += randColor.g * random();
		    col.b += randColor.b * random();
		    col.check();
		}
		
		if( worldSpace ){
		    pos.x = position.x;
		    pos.y = position.y;
		    pos.z = position.z;
		}
		else{
		    pos.x = pos.y = pos.z = 0
		}
		particle.rotation = 0;
		
		particle.lifeTime = 0;
		particle.life = randFloat( minLife, maxLife );
		particle.size = randFloat( minSize, maxSize );
		
		vel.x = velocity.x + randFloat( -randVelocity.x, randVelocity.x );
		vel.y = velocity.y + randFloat( -randVelocity.y, randVelocity.y );
		vel.z = velocity.z + randFloat( -randVelocity.z, randVelocity.z );
		particle.angularVelocity = angularVelocity + randFloat( -randAngularVelocity, randAngularVelocity )
		
		if( randRotation ) particle.rotation = random() * TWO_PI;
		
		particle.alpha = alphaStart;
		
		particles.push( particle );
	    }
	    
	    this.playing = true;
	};
	
	
	Emitter.prototype.update = function(){
	    if( this.time > this.duration && !this.loop ) this.playing = false;
	    if( !this.playing && this.particles.length === 0 ) return;
	    
	    var dt = Time.delta,
		forces = this.forces,
		particles = this.particles, particle,
		ppos, pvel, alpha, alphaStart = this.alphaStart,
		t, d, p,
		i;
	    
	    this.time += dt;
	    this._time += dt;
	    
	    if( this.playing && this._time > this.emissionRate ){
		this._time = 0;
		
		this.spawn( randInt( this.minEmission, this.maxEmission ) );
	    }
	    
	    for( i = particles.length; i--; ){
		particle = particles[i];
		
		t = particle.lifeTime;
		d = particle.life;
		p = t / d;
		
		if( p > 1 ){
		    particlePool.removeObject( particle );
		    particles.splice( i, 1 );
		    continue;
		}
		
		ppos = particle.position;
		pvel = particle.velocity;
		
		ppos.x += pvel.x * dt;
		ppos.y += pvel.y * dt;
		ppos.z += pvel.z * dt;
		particle.rotation += particle.angularVelocity * dt;
		
		particle.lifeTime += dt;
		particle.alpha = 1 - p;
	    }
	};
	
	
	/**
	 * @class Emitter.Particle
	 * @brief 2d particle
	 */
	function Particle(){
	    
	    /**
	    * @property Number alpha
	    * @memberof Emitter.Particle
	    */
	    this.alpha = 0;
	    
	    /**
	    * @property Number lifeTime
	    * @memberof Emitter.Particle
	    */
	    this.lifeTime = 0;
	    
	    /**
	    * @property Number life
	    * @memberof Emitter.Particle
	    */
	    this.life = 1;
	    
	    /**
	    * @property Number size
	    * @memberof Emitter.Particle
	    */
	    this.size = 1;
	    
	    /**
	    * @property Color color
	    * @memberof Emitter.Particle
	    */
	    this.color = new Color;
	    
	    /**
	    * @property Vec3 position
	    * @memberof Emitter.Particle
	    */
	    this.position = new Vec3;
	    
	    /**
	    * @property Vec3 velocity
	    * @memberof Emitter.Particle
	    */
	    this.velocity = new Vec3;
	    
	    /**
	    * @property Number rotation
	    * @memberof Emitter.Particle
	    */
	    this.rotation = 0;
	    
	    /**
	    * @property Number angularVelocity
	    * @memberof Emitter.Particle
	    */
	    this.angularVelocity = 0;
	    
	}
	
	Emitter.Particle = Particle;
	Emitter.MAX_PARTICLES = 1024;
	
	
        return Emitter;
    }
);