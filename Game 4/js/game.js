const CONFIG = {
    player: {
        width: 75,
        height: 75,

        startX: 100,
        startY: 500,

        acceleration: 0.2,
        maxSpeed: 8,
        friction: 0.95,

        gravity: 0.4,
        jumpStrength: -15,

        spindashSpeed: 15,
        spindashChargeFrames: 30
    },

    ground: {
        height: 50,
        color: "blue"
    },

    game: {
        zoneDisplayTimer: 2005
    },

    enemy: {
        width: 50,
        height: 50,
        speed: 2,
        patrolDistance: 200
    },

    assets: {
        images: {
            titleScreen: 'images/TitleScreen.png',
            background: 'images/green_hill.gif',
            sonicIdle: 'images/sonic.png',
            sonicWalk: 'images/sonic_walk.gif',
            sonicRun: 'images/sonic_run.gif',
            sonicJump: 'images/sonic_jump.gif',
            sonicCrouch: 'images/sonic_crouch.gif',
            sonicSpindash: 'images/sonic_spindash.gif'
        },
        audio: {
            titleMusic: 'audio/title.mp3',
            bgMusic: 'audio/green_hill.ogg',
            jumpSound: 'audio/jump.wav',
            spindashSound: 'audio/spindash.wav'
        }
    }
};

class Player {
    constructor(assetManager) {
        // Position and size
        this.x = CONFIG.player.startX;
        this.y = CONFIG.player.startY;
        this.width = CONFIG.player.width;
        this.height = CONFIG.player.height;

        // Velocity
        this.velocityX = 0;
        this.velocityY = 0;

        // Physics constants
        this.acceleration = CONFIG.player.acceleration;
        this.maxSpeed = CONFIG.player.maxSpeed;
        this.gravity = CONFIG.player.gravity;
        this.jumpStrength = CONFIG.player.jumpStrength;

        // State
        this.onGround = false;
        this.facing = 1;
        this.animation = 'idle';
        this.spindashMode = false;
        this.spindashCharge = 0;
        this.spindashTimer = 0;
        
        // Store asset manager reference
        this.assets = assetManager;

        // Jump control - prevent bunny hopping
        this.jumpKeyWasPressed = false;
    }

    update(keys, ground) {
        // Horizontal movement
        if (keys['a']) {
            this.velocityX -= this.acceleration;
            if (this.velocityX < -this.maxSpeed) this.velocityX = -this.maxSpeed;
            this.facing = -1;
        } else if (keys['d']) {
            this.velocityX += this.acceleration;
            if (this.velocityX > this.maxSpeed) this.velocityX = this.maxSpeed;
            this.facing = 1;
        } else {
            this.velocityX *= CONFIG.player.friction;
        }

        // Jumping - must release and press again (no bunny hopping)
        if (keys[' ']) {
            if (this.onGround && !this.spindashMode && !this.jumpKeyWasPressed) {
                this.velocityY = this.jumpStrength;
                this.onGround = false;
                this.assets.getAudio('jumpSound').play();
            }
            this.jumpKeyWasPressed = true;  // Mark that jump key is being held
        } else {
            this.jumpKeyWasPressed = false;  // Reset when key is released
        }

        // Spindash: Press 's' to crouch, hold to charge, release to dash
        if (keys['s'] && this.onGround) {
            if (!this.spindashMode) {
                this.spindashMode = true;
                this.animation = 'crouch';
                this.spindashTimer = 0;
                this.assets.getAudio('spindashSound').play();
            } else {
                // Charging
                this.spindashCharge += 1;
                this.spindashTimer += 1;
                if (this.spindashTimer > CONFIG.player.spindashChargeFrames) {
                    this.animation = 'spindash';
                }
            }
        } else if (!keys['s'] && this.spindashMode && this.spindashCharge > 0) {
            // Release: Dash with jump animation
            this.velocityX = this.facing * CONFIG.player.spindashSpeed * (this.spindashCharge / 10);
            this.spindashCharge = 0;
            this.spindashTimer = 0;
            this.animation = 'jump';
            this.spindashMode = false;
        }

        // Apply horizontal velocity
        this.x += this.velocityX;

        // Apply gravity
        this.velocityY += this.gravity;
        this.y += this.velocityY;

        // Ground collision
        if (this.y + this.height >= ground.y) {
            this.y = ground.y - this.height;
            this.velocityY = 0;
            this.onGround = true;
            if (this.animation === 'spindash') {
                this.animation = 'idle';
                this.spindashMode = false;
                this.spindashTimer = 0;
            }
        }

        // Horizontal bounds
        if (this.x < 0) {
            this.x = 0;
            if (this.animation === 'jump') {
                this.animation = 'idle';
                this.velocityX = 0;
                this.spindashMode = false;
                this.spindashTimer = 0;
            }
        }
        if (this.x + this.width > canvas.width) {
            this.x = canvas.width - this.width;
            if (this.animation === 'jump') {
                this.animation = 'idle';
                this.velocityX = 0;
                this.spindashMode = false;
                this.spindashTimer = 0;
            }
        }

        // Stop spindash if charge runs out
        if (this.animation === 'jump' && Math.abs(this.velocityX) < 1) {
            this.animation = 'idle';
            this.spindashMode = false;
            this.spindashTimer = 0;
        }

        // Set animation based on state
        if (this.spindashMode || this.animation === 'jump') {
            // Keep spindash states
        } else if (!this.onGround) {
            this.animation = 'jump';
        } else if (Math.abs(this.velocityX) > this.maxSpeed * 0.8) {
            this.animation = 'run';
        } else if (Math.abs(this.velocityX) > 0.5) {
            this.animation = 'walk';
        } else {
            this.animation = 'idle';
        }
    }

    draw() {
        const playerImg = document.getElementById('playerImg');
        let src;
        switch (this.animation) {
            case 'idle': src = 'images/sonic.png'; break;
            case 'walk': src = 'images/sonic_walk.gif'; break;
            case 'run': src = 'images/sonic_run.gif'; break;
            case 'jump': src = 'images/sonic_jump.gif'; break;
            case 'crouch': src = 'images/sonic_crouch.gif'; break;
            case 'spindash': src = 'images/sonic_spindash.gif'; break;
        }
        playerImg.src = src;
        playerImg.style.left = this.x + 'px';
        playerImg.style.top = this.y + 'px';
        if (this.facing < 0) {
            playerImg.style.transform = 'scaleX(-1)';
        } else {
            playerImg.style.transform = 'scaleX(1)';
        }
    }
}
class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.enemy.width;
        this.height = CONFIG.enemy.height;
        this.speed = CONFIG.enemy.speed;
        
        // Movement
        this.startX = x;
        this.direction = 1;  // 1 = right, -1 = left
        this.patrolDistance = CONFIG.enemy.patrolDistance;
        
        // State
        this.isAlive = true;
    }
    
    update() {
        if (!this.isAlive) return;
        
        // Patrol back and forth
        this.x += this.speed * this.direction;
        
        // Turn around at patrol boundaries
        if (this.x > this.startX + this.patrolDistance) {
            this.direction = -1;
        } else if (this.x < this.startX - this.patrolDistance) {
            this.direction = 1;
        }
    }
    
    draw(ctx) {
        if (!this.isAlive) return;
        
        // Draw enemy as red rectangle (we'll add sprites later)
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw eyes
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x + 10, this.y + 10, 10, 10);
        ctx.fillRect(this.x + 30, this.y + 10, 10, 10);
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x + 15, this.y + 15, 5, 5);
        ctx.fillRect(this.x + 35, this.y + 15, 5, 5);
    }
    
    checkCollision(player) {
        if (!this.isAlive) return false;
        
        return player.x < this.x + this.width &&
               player.x + player.width > this.x &&
               player.y < this.y + this.height &&
               player.y + player.height > this.y;
    }
    
    destroy() {
        this.isAlive = false;
    }
}
class AssetManager {
    constructor() {
        this.images = {};
        this.audio = {};
        this.loadedCount = 0;
        this.totalAssets = 0;
    }

    loadImage(name, src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.images[name] = img;
                this.loadedCount++;
                resolve(img);
            };
            img.onerror = () => {
                console.error(`Failed to load image: ${src}`);
                reject(new Error(`Failed to load image: ${src}`));
            };
            img.src = src;
        });
    }

    loadAudio(name, src) {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.oncanplaythrough = () => {
                this.audio[name] = audio;
                this.loadedCount++;
                resolve(audio);
            };
            audio.onerror = () => {
                console.error(`Failed to load audio: ${src}`);
                reject(new Error(`Failed to load audio: ${src}`));
            };
            audio.src = src;
        });
    }

    async loadAll() {
        const imagePromises = [];
        const audioPromises = [];

        // Load all images from CONFIG
        for (const [name, src] of Object.entries(CONFIG.assets.images)) {
            imagePromises.push(this.loadImage(name, src));
            this.totalAssets++;
        }

        // Load all audio from CONFIG
        for (const [name, src] of Object.entries(CONFIG.assets.audio)) {
            audioPromises.push(this.loadAudio(name, src));
            this.totalAssets++;
        }

        // Wait for all assets to load
        await Promise.all([...imagePromises, ...audioPromises]);
    }

    getImage(name) {
        return this.images[name];
    }

    getAudio(name) {
        return this.audio[name];
    }

    getProgress() {
        return this.totalAssets > 0 ? this.loadedCount / this.totalAssets : 0;
    }
}

class Game {
    constructor(canvas, ctx, assetManager) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.assets = assetManager;

        this.state = 'title';

        this.player = new Player(assetManager);
        this.ground = {
            x: 0,
            y: canvas.height - CONFIG.ground.height,
            width: canvas.width,
            height: CONFIG.ground.height,
            color: CONFIG.ground.color,
        };

        this.keys = {};

        // Create enemies
        this.enemies = [
            new Enemy(400, this.ground.y - CONFIG.enemy.height),
            new Enemy(700, this.ground.y - CONFIG.enemy.height)
        ];

        this.setupInputHandlers();
    }

    setupInputHandlers() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            if (this.state === 'title' && e.key === ' ') {
                this.state = 'zone';
                setTimeout(() => this.state = 'game', CONFIG.game.zoneDisplayTimer);
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }

drawTitle() {
    // OLD: this.ctx.drawImage(this.titleImg, 0, 0, this.canvas.width, this.canvas.height);
    // NEW:
    this.ctx.drawImage(this.assets.getImage('titleScreen'), 0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = 'white';
    this.ctx.font = '24px Arial';
    this.ctx.fillText('Press SPACE to Start', this.canvas.width / 2 - 100, this.canvas.height - 50);
}

    drawZone() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '48px Arial';
        this.ctx.fillText('Test Zone', this.canvas.width / 2 - 150, this.canvas.height / 2);
    }

    drawBackground() {
    // OLD: this.ctx.drawImage(this.backgroundImg, 0, 0, this.canvas.width, this.canvas.height);
    // NEW:
    this.ctx.drawImage(this.assets.getImage('background'), 0, 0, this.canvas.width, this.canvas.height);
}

    drawGround() {
        this.ctx.fillStyle = this.ground.color;
        this.ctx.fillRect(this.ground.x, this.ground.y, this.ground.width, this.ground.height);
    }

    
loop() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    if (this.state === 'title') {
        this.drawTitle();
        const titleMusic = this.assets.getAudio('titleMusic');  // ✅ Changed
        if (titleMusic.paused) titleMusic.play();
        this.assets.getAudio('bgMusic').pause();  // ✅ Changed
        document.getElementById('playerImg').style.display = 'none';
    } else if (this.state === 'zone') {
        this.drawZone();
        this.assets.getAudio('titleMusic').pause();  // ✅ Changed
        this.assets.getAudio('bgMusic').pause();  // ✅ Changed
        document.getElementById('playerImg').style.display = 'none';
    } else if (this.state === 'game') {
        this.player.update(this.keys, this.ground);
        
        // Update and check enemies
        for (let enemy of this.enemies) {
            enemy.update();
            
            if (enemy.checkCollision(this.player)) {
                // Check if player is attacking (jumping from above or spindashing)
                const isJumpingDown = !this.player.onGround && this.player.velocityY > 0;
                const isSpindashing = this.player.animation === 'jump' && Math.abs(this.player.velocityX) > this.player.maxSpeed;
                
                if (isJumpingDown) {
                    // Player destroys enemy by jumping on it
                    enemy.destroy();
                    this.player.velocityY = CONFIG.player.jumpStrength * 0.5;  // Bounce
                } else if (isSpindashing) {
                    // Spindash destroys enemy
                    enemy.destroy();
                } else {
                    // Enemy hits player (placeholder for damage)
                    console.log('Player hit by enemy! (Will add damage system later)');
                    // TODO: Add knockback, rings loss, invincibility frames
                }
            }
        }
        
        this.drawBackground();
        this.drawGround();
        
        // Draw enemies
        for (let enemy of this.enemies) {
            enemy.draw(this.ctx);
        }
        
        this.player.draw();
        const bgMusic = this.assets.getAudio('bgMusic');
        if (bgMusic.paused) bgMusic.play();
        document.getElementById('playerImg').style.display = 'block';
    }
    
    requestAnimationFrame(() => this.loop());
}

    start() {
        document.getElementById('playerImg').style.display = 'block';
        this.loop();
    }
}

// Get the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Create asset manager and load all assets
const assetManager = new AssetManager();
assetManager.loadAll().then(() => {
    // After assets load, create and start the game
    const game = new Game(canvas, ctx, assetManager);
    game.start();
});