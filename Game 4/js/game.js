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

    ring: {
        width: 30,
        height: 30,
        value: 1
    },

    playerSettings: {
        startLives: 3,
        invincibilityFrames: 120,  // 2 seconds at 60fps
        knockbackForce: 10
    },

    platform: {
        width: 100,
        height: 20,
        color: 'brown'

    },

    spring: {
        width: 40,
        height: 20,
        bounceStrength: -20,
        color: 'yellow'
    },

    goal: {
        width: 50,
        height: 100,
        color: 'purple'
    },

    level: {
        width: 4000,
        completeMessage: "ZONE CLEARED!"
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
            sonicSpindash: 'images/sonic_spindash.gif',
            sonicDeath: 'images/sonic_dead.png',
            sonicHurt: 'images/sonic_hurt.png'
        },
        audio: {
            titleMusic: 'audio/title.mp3',
            bgMusic: 'audio/green_hill.ogg',
            jumpSound: 'audio/jump.wav',
            spindashSound: 'audio/spindash.wav',
            springSound: 'audio/spring.wav'
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
        
        // Rings and lives system
        this.rings = 0;
        this.lives = CONFIG.playerSettings.startLives;
        this.isInvincible = false;
        this.invincibilityTimer = 0;
        this.isDead = false;
        this.deathAnimationFrame = 0;
        this.isDeathAnimating = false;
        this.deathAnimVy = 0;
        this.deathAnimTimer = 0;
        this.hurtTimer = 0;
    }

    update(keys, ground, game) {
        // If death animation is running, override normal update
        if (this.isDeathAnimating) {
            this.deathAnimTimer++;
            // On first frame, bounce up
            if (this.deathAnimTimer === 1) {
                this.deathAnimVy = -12;
            }
            // Apply gravity
            this.deathAnimVy += this.gravity;
            this.y += this.deathAnimVy;
            // Move slightly horizontally for effect
            this.x += 1.5 * this.facing;
            // If off screen, finish animation
            if (this.y > ground.y + 200) {
                this.isDeathAnimating = false;
                this.isDead = true;
            }
            return;
        }

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
        let onPlatform = false;
        for (let platform of game.platforms) {
            if (platform.checkCollision(this)) {
                this.y = platform.y - this.height;
                this.velocityY = 0;
                this.onGround = true;
                onPlatform = true;
                break;  // Only land on one platform
            }
        }
        
        // If not on platform, check ground
        if (!onPlatform && this.y + this.height >= ground.y) {
            this.y = ground.y - this.height;
            this.velocityY = 0;
            this.onGround = true;
            if (this.animation === 'spindash') {
                this.animation = 'idle';
                this.spindashMode = false;
                this.spindashTimer = 0;
            }
        } else if (!onPlatform) {
            this.onGround = false;
        }

        // Spring collision
        for (let spring of game.springs) {
            if (spring.checkCollision(this)) {
                this.velocityY = CONFIG.spring.bounceStrength;
                this.onGround = false;
                const springAudio = this.assets.getAudio('springSound');
                if (springAudio) springAudio.play();
                break;  // Only bounce on one spring
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
        
        // Handle invincibility timer
        if (this.isInvincible) {
            this.invincibilityTimer--;
            if (this.invincibilityTimer <= 0) {
                this.isInvincible = false;
            }
        }

        // Handle hurt timer
        if (this.hurtTimer > 0) {
            this.hurtTimer--;
            if (this.hurtTimer === 0) {
                this.makeInvincible();
            }
        }
    }

    draw() {
        const playerImg = document.getElementById('playerImg');
        // Flashing during invincibility (not during hurt)
        if (this.isInvincible && this.hurtTimer === 0 && Math.floor(this.invincibilityTimer / 5) % 2 === 1) {
            playerImg.style.display = 'none';
            return;
        } else {
            playerImg.style.display = 'block';
        }
        let src;
        if (this.isDeathAnimating) {
            src = CONFIG.assets.images.sonicDeath;
        } else if (this.hurtTimer > 0) {
            src = CONFIG.assets.images.sonicHurt;
        } else {
            switch (this.animation) {
                case 'idle': src = CONFIG.assets.images.sonicIdle; break;
                case 'walk': src = CONFIG.assets.images.sonicWalk; break;
                case 'run': src = CONFIG.assets.images.sonicRun; break;
                case 'jump': src = CONFIG.assets.images.sonicJump; break;
                case 'crouch': src = CONFIG.assets.images.sonicCrouch; break;
                case 'spindash': src = CONFIG.assets.images.sonicSpindash; break;
            }
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
    
    collectRing() {
        this.rings++;
    }
    
    loseRings(game) {
        if (this.rings > 0) {
            // Scatter rings in random directions
            for (let i = 0; i < this.rings; i++) {
                // Random angle and speed
                const angle = (Math.PI * 2 * i) / this.rings;  // Evenly spread
                const speed = 3 + Math.random() * 2;  // 3-5 pixels/frame
                const velocityX = Math.cos(angle) * speed;
                const velocityY = Math.sin(angle) * speed - 2;  // Slight upward
                
                // Create scattered ring at player position
                const scatteredRing = new ScatteredRing(
                    this.x + this.width / 2,
                    this.y + this.height / 2,
                    velocityX,
                    velocityY
                );
                game.scatteredRings.push(scatteredRing);
            }
            this.rings = 0;
            this.makeInvincible();
        } else {
            this.die();
        }
    }
    
    makeInvincible() {
        this.isInvincible = true;
        this.invincibilityTimer = CONFIG.playerSettings.invincibilityFrames;
    }
    
    die() {
        this.lives--;
        this.isDeathAnimating = true;
        this.deathAnimTimer = 0;
        this.deathAnimVy = 0;
        // Play death sound if you have one: this.assets.getAudio('deathSound')?.play();
        // Don't set isDead yet; wait for animation to finish
        console.log('Sonic died! Lives remaining:', this.lives);
    }
    
    respawn() {
        this.x = CONFIG.player.startX;
        this.y = CONFIG.player.startY;
        this.velocityX = 0;
        this.velocityY = 0;
        this.rings = 0;
        this.isDead = false;
        this.hurtTimer = 0;
        this.makeInvincible();
    }
    
    takeDamage(game) {
        if (this.isInvincible || this.hurtTimer > 0) return;
        this.loseRings(game);
        // Knockback
        this.velocityX = -this.facing * CONFIG.playerSettings.knockbackForce;
        this.velocityY = -5;
        // Hurt animation
        this.hurtTimer = 30; // 0.5 seconds at 60fps
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
    
    draw(ctx, cameraX) {
        if (!this.isAlive) return;
        
        // Draw enemy as red rectangle (we'll add sprites later)
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);
        
        // Draw eyes
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x - cameraX + 10, this.y + 10, 10, 10);
        ctx.fillRect(this.x - cameraX + 30, this.y + 10, 10, 10);
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x - cameraX + 15, this.y + 15, 5, 5);
        ctx.fillRect(this.x - cameraX + 35, this.y + 15, 5, 5);
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

// ============================
// RING CLASS
// ============================
class Ring {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.ring.width;
        this.height = CONFIG.ring.height;
        this.collected = false;
        this.animationFrame = 0;
    }
    
    update() {
        if (this.collected) return;
        this.animationFrame = (this.animationFrame + 0.2) % 360;
    }
    
    draw(ctx, cameraX) {
        if (this.collected) return;
        
        ctx.save();
        ctx.translate((this.x - cameraX) + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.animationFrame * Math.PI / 180);
        
        ctx.fillStyle = 'gold';
        ctx.strokeStyle = 'orange';
        ctx.lineWidth = 3;
        
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    checkCollision(player) {
        if (this.collected) return false;
        
        return player.x < this.x + this.width &&
               player.x + player.width > this.x &&
               player.y < this.y + this.height &&
               player.y + player.height > this.y;
    }
    
    collect() {
        this.collected = true;
    }
}

class ScatteredRing {
    constructor(x, y, velocityX, velocityY) {
        this.x = x;
        this.y = y;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.width = CONFIG.ring.width;
        this.height = CONFIG.ring.height;
        this.collected = false;
        this.animationFrame = 0;
        this.lifetime = 480;  // 8 seconds at 60fps before disappearing  
    }

        update() {
        if (this.collected) return;
        
        // Apply gravity (rings fall down)
        this.velocityY += 0.2;
        
        // Move
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // Rotate for animation
        this.animationFrame = (this.animationFrame + 0.2) % 360;
        
        // Countdown lifetime
        this.lifetime--;
        if (this.lifetime <= 0) {
            this.collected = true;  // Remove after time
        }
    }

        draw(ctx, cameraX) {
        if (this.collected) return;
        
        ctx.save();
        ctx.translate((this.x - cameraX) + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.animationFrame * Math.PI / 180);
        
        ctx.fillStyle = 'gold';
        ctx.strokeStyle = 'orange';
        ctx.lineWidth = 3;
        
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

        checkCollision(player) {
        if (this.collected) return false;
        
        return player.x < this.x + this.width &&
               player.x + player.width > this.x &&
               player.y < this.y + this.height &&
               player.y + player.height > this.y;
    }
    
    collect() {
        this.collected = true;
    }
}

// ============================
// PLATFORM CLASS
// ============================
class Platform {
    constructor(x, y, width) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = CONFIG.platform.height;
    }

        draw(ctx, cameraX) {
        ctx.fillStyle = CONFIG.platform.color;
        ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);
    }
    
    checkCollision(player) {
        // Only collide if player is falling onto platform (from above)
        if (player.velocityY > 0 && 
            player.y + player.height <= this.y + 10 &&  // Close to platform top
            player.y + player.height >= this.y &&       // Touching or slightly below
            player.x + player.width > this.x &&
            player.x < this.x + this.width) {
            return true;
        }
        return false;
    }
}

// ============================
// SPRING CLASS
// ============================
class Spring {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.spring.width;
        this.height = CONFIG.spring.height;
        this.bounceStrength = CONFIG.spring.bounceStrength;
        this.animationFrame = 0;
        this.isBouncing = false;
    }
    
    update() {
        if (this.isBouncing) {
            this.animationFrame++;
            if (this.animationFrame > 10) {  // Animation lasts 10 frames
                this.isBouncing = false;
                this.animationFrame = 0;
            }
        }
    }
    
    draw(ctx, cameraX) {
        ctx.fillStyle = CONFIG.spring.color;
        ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);
        
        // Draw spring coils (simple animation)
        ctx.fillStyle = 'black';
        const coilHeight = this.isBouncing ? 5 : 10;  // Compress when bouncing
        for (let i = 0; i < 3; i++) {
            ctx.fillRect(this.x - cameraX + 5 + i * 10, this.y + 5, 5, coilHeight);
        }
    }
    
    checkCollision(player) {
        return player.x < this.x + this.width &&
               player.x + player.width > this.x &&
               player.y < this.y + this.height &&
               player.y + player.height > this.y;
    }
    
    bounce(player) {
        player.velocityY = this.bounceStrength;  // Launch up!
        player.onGround = false;
        this.isBouncing = true;  // Trigger animation
        // TODO: Play spring sound
    }
}

// ============================
// GOAL CLASS
// ============================
class Goal {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.goal.width;
        this.height = CONFIG.goal.height;
    }
    
    draw(ctx, cameraX) {
        ctx.fillStyle = CONFIG.goal.color;
        ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);
        
        // Draw flag pole
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x - cameraX + this.width / 2 - 2, this.y, 4, this.height);
        
        // Draw flag
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x - cameraX + this.width / 2 + 2, this.y + 10, 20, 15);
    }
    
    update() {
        // Goal doesn't need animation, but method is required for consistency
    }
    
    checkCollision(player) {
        return player.x < this.x + this.width &&
               player.x + player.width > this.x &&
               player.y < this.y + this.height &&
               player.y + player.height > this.y;
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
    drawGameOver() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.fillText('GAME OVER', this.canvas.width / 2 - 160, this.canvas.height / 2 - 40);
        this.ctx.font = '24px Arial';
        this.ctx.fillText('Press R to Restart', this.canvas.width / 2 - 100, this.canvas.height / 2 + 40);
    }
    
    drawLevelComplete() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'gold';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.fillText('LEVEL COMPLETE!', this.canvas.width / 2 - 200, this.canvas.height / 2 - 40);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`Time: ${this.formatTime(this.timer)}`, this.canvas.width / 2 - 80, this.canvas.height / 2 + 20);
        this.ctx.fillText(`Rings: ${this.player.rings}`, this.canvas.width / 2 - 60, this.canvas.height / 2 + 50);
        this.ctx.fillText('Press R to Restart', this.canvas.width / 2 - 100, this.canvas.height / 2 + 80);
    }
    
    formatTime(frames) {
        const totalSeconds = Math.floor(frames / 60);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    constructor(canvas, ctx, assetManager) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.assets = assetManager;

        this.state = 'title';

        this.player = new Player(assetManager);
        this.ground = {
            x: 0,
            y: canvas.height - CONFIG.ground.height,
            width: CONFIG.level.width,  // Level width
            height: CONFIG.ground.height,
            color: CONFIG.ground.color,
        };

        this.keys = {};

        // Create enemies across the level
        this.enemies = [
            new Enemy(400, this.ground.y - CONFIG.enemy.height),
            new Enemy(700, this.ground.y - CONFIG.enemy.height),
            new Enemy(1200, this.ground.y - CONFIG.enemy.height),
            new Enemy(1600, this.ground.y - CONFIG.enemy.height)
        ];
        
        // Create rings across the level
        this.rings = [
            new Ring(250, this.ground.y - 100),
            new Ring(300, this.ground.y - 100),
            new Ring(350, this.ground.y - 100),
            new Ring(500, this.ground.y - 50),
            new Ring(550, this.ground.y - 50),
            new Ring(600, this.ground.y - 150),
            new Ring(1000, this.ground.y - 80),
            new Ring(1100, this.ground.y - 120),
            new Ring(1500, this.ground.y - 60),
            new Ring(1600, this.ground.y - 100)
        ];

        this.setupInputHandlers();
        this.deathBlackScreenTimer = 0;
        this.timer = 0;
        this.scatteredRings = [];
        this.cameraX = 0;
        this.levelWidth = CONFIG.level.width;  // Bigger level!

        // Create platforms across the level
        this.platforms = [
            new Platform(800, 450, 150, 20),   // Floating platform
            new Platform(1100, 400, 100, 20),  // Another one
            new Platform(1400, 350, 120, 20),  // Higher platform
            new Platform(1800, 300, 200, 20),  // Big platform
            new Platform(2200, 400, 150, 20),  // More platforms
            new Platform(2500, 350, 100, 20),
            new Platform(2800, 450, 120, 20),
            new Platform(3200, 300, 180, 20)
        ];
        
        // Create springs on platforms
        this.springs = [
            new Spring(850, 430),   // On first platform
            new Spring(1450, 330),  // On higher platform
            new Spring(2850, 430)   // Near end
        ];
        
        // Create goal at the end
        this.goal = new Goal(3800, this.ground.y - CONFIG.goal.height);
    }

    setupInputHandlers() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            if (this.state === 'title' && e.key === ' ') {
                this.state = 'zone';
                setTimeout(() => this.state = 'game', CONFIG.game.zoneDisplayTimer);
            }
            if (this.state === 'gameover' && (e.key === 'r' || e.key === 'R')) {
                this.restartGame();
            }
            if (this.state === 'levelcomplete' && (e.key === 'r' || e.key === 'R')) {
                this.restartGame();
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }

    restartGame() {
        this.player = new Player(this.assets);
        this.enemies = [
            new Enemy(400, this.ground.y - CONFIG.enemy.height),
            new Enemy(700, this.ground.y - CONFIG.enemy.height)
        ];
        this.rings = [
            new Ring(250, this.ground.y - 100),
            new Ring(300, this.ground.y - 100),
            new Ring(350, this.ground.y - 100),
            new Ring(500, this.ground.y - 50),
            new Ring(550, this.ground.y - 50),
            new Ring(600, this.ground.y - 150)
        ];
        this.platforms = [
            new Platform(800, this.ground.y - 100, 200),
            new Platform(1200, this.ground.y - 150, 150),
            new Platform(1600, this.ground.y - 200, 200),
            new Platform(2000, this.ground.y - 100, 150),
            new Platform(2400, this.ground.y - 150, 200),
            new Platform(2800, this.ground.y - 200, 150),
            new Platform(3200, this.ground.y - 100, 200)
        ];
        this.springs = [
            new Spring(850, this.ground.y - 100 - CONFIG.spring.height),
            new Spring(1250, this.ground.y - 150 - CONFIG.spring.height),
            new Spring(2050, this.ground.y - 100 - CONFIG.spring.height),
            new Spring(2850, this.ground.y - 200 - CONFIG.spring.height)
        ];
        this.goal = new Goal(3800, this.ground.y - CONFIG.goal.height);
        this.state = 'title';
    }

    restartLevel() {
        const currentLives = this.player.lives;
        this.player = new Player(this.assets);
        this.player.lives = currentLives;
        this.enemies = [
            new Enemy(400, this.ground.y - CONFIG.enemy.height),
            new Enemy(700, this.ground.y - CONFIG.enemy.height)
        ];
        this.rings = [
            new Ring(250, this.ground.y - 100),
            new Ring(300, this.ground.y - 100),
            new Ring(350, this.ground.y - 100),
            new Ring(500, this.ground.y - 50),
            new Ring(550, this.ground.y - 50),
            new Ring(600, this.ground.y - 150)
        ];
        this.platforms = [
            new Platform(800, this.ground.y - 100, 200),
            new Platform(1200, this.ground.y - 150, 150),
            new Platform(1600, this.ground.y - 200, 200),
            new Platform(2000, this.ground.y - 100, 150),
            new Platform(2400, this.ground.y - 150, 200),
            new Platform(2800, this.ground.y - 200, 150),
            new Platform(3200, this.ground.y - 100, 200)
        ];
        this.springs = [
            new Spring(850, this.ground.y - 100 - CONFIG.spring.height),
            new Spring(1250, this.ground.y - 150 - CONFIG.spring.height),
            new Spring(2050, this.ground.y - 100 - CONFIG.spring.height),
            new Spring(2850, this.ground.y - 200 - CONFIG.spring.height)
        ];
        this.goal = new Goal(3800, this.ground.y - CONFIG.goal.height);
        this.deathBlackScreenTimer = 0;
        this.timer = 0;
        this.scatteredRings = [];
        this.cameraX = 0;
        // Restart background music
        const bgMusic = this.assets.getAudio('bgMusic');
        bgMusic.currentTime = 0;
        bgMusic.play();
        // Stay in 'game' state
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
    this.ctx.drawImage(this.assets.getImage('background'), -this.cameraX, 0, this.canvas.width, this.canvas.height);
}

    drawGround() {
        this.ctx.fillStyle = this.ground.color;
        this.ctx.fillRect(this.ground.x - this.cameraX, this.ground.y, this.ground.width, this.ground.height);
    }
    
    drawHUD() {
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 3;
        
        // TIME
        const minutes = Math.floor(this.timer / 3600);
        const seconds = Math.floor((this.timer % 3600) / 60);
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        this.ctx.strokeText('TIME ' + timeString, 20, 40);
        this.ctx.fillText('TIME ' + timeString, 20, 40);
        
        // RINGS
        this.ctx.strokeText('RINGS ' + this.player.rings.toString().padStart(2, '0'), 20, 70);
        this.ctx.fillText('RINGS ' + this.player.rings.toString().padStart(2, '0'), 20, 70);
        
        // LIVES (icon and count at bottom left)
        this.ctx.drawImage(this.assets.getImage('sonicIdle'), 20, this.canvas.height - 50, 30, 30);
        this.ctx.strokeText('x' + this.player.lives, 60, this.canvas.height - 30);
        this.ctx.fillText('x' + this.player.lives, 60, this.canvas.height - 30);
        
        // Draw invincibility indicator
        if (this.player.isInvincible) {
            this.ctx.fillStyle = 'yellow';
            this.ctx.fillText('INVINCIBLE', this.canvas.width / 2 - 70, 40);
        }
    }

    
loop() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    if (this.state === 'title') {
        this.drawTitle();
        const titleMusic = this.assets.getAudio('titleMusic');
        if (titleMusic.paused) titleMusic.play();
        this.assets.getAudio('bgMusic').pause();
        document.getElementById('playerImg').style.display = 'none';
    } else if (this.state === 'zone') {
        this.drawZone();
        this.assets.getAudio('titleMusic').pause();
        this.assets.getAudio('bgMusic').pause();
        document.getElementById('playerImg').style.display = 'none';
    } else if (this.state === 'game') {
        // If player is in death animation, update and draw only player
        if (this.player.isDeathAnimating) {
            // Draw level and dying Sonic
            this.drawBackground();
            this.drawGround();
            for (let ring of this.rings) ring.draw(this.ctx);
            for (let enemy of this.enemies) enemy.draw(this.ctx);
            this.player.update(this.keys, this.ground, this);
            this.player.draw();
            this.drawHUD();
            document.getElementById('playerImg').style.display = 'block';
        } else if (this.player.isDead) {
            // Black screen after death animation
            this.ctx.fillStyle = 'black';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            document.getElementById('playerImg').style.display = 'none';
            if (this.deathBlackScreenTimer === 0) {
                this.deathBlackScreenTimer = 60; // 1 second at 60fps
            }
            this.deathBlackScreenTimer--;
            if (this.deathBlackScreenTimer <= 0) {
                if (this.player.lives > 0) {
                    this.restartLevel();
                } else {
                    this.state = 'gameover';
                }
            }
        } else {
            this.player.update(this.keys, this.ground, this);
            // Update and check rings
            for (let ring of this.rings) {
                ring.update();
                if (ring.checkCollision(this.player)) {
                    ring.collect();
                    this.player.collectRing();
                }
            }
            // Update springs
            for (let spring of this.springs) {
                spring.update();
            }
            // Update goal
            this.goal.update();
            if (this.goal.checkCollision(this.player)) {
                this.state = 'levelcomplete';
            }
            // Update and check enemies
            for (let enemy of this.enemies) {
                enemy.update();
                if (enemy.checkCollision(this.player)) {
                    const isJumpingDown = !this.player.onGround && this.player.velocityY > 0;
                    const isSpindashing = this.player.animation === 'jump' && Math.abs(this.player.velocityX) > this.player.maxSpeed;
                    if (isJumpingDown) {
                        enemy.destroy();
                        this.player.velocityY = CONFIG.player.jumpStrength * 0.5;
                    } else if (isSpindashing) {
                        enemy.destroy();
                    } else {
                        this.player.takeDamage(this);
                    }
                }
            }
            // Update and check scattered rings
            for (let i = this.scatteredRings.length - 1; i >= 0; i--) {
                const ring = this.scatteredRings[i];
                ring.update();
                if (ring.checkCollision(this.player)) {
                    ring.collect();
                    this.player.collectRing();
                    this.scatteredRings.splice(i, 1);  // Remove from array
                } else if (ring.lifetime <= 0) {
                    this.scatteredRings.splice(i, 1);  // Remove expired
                }
            }
            // Update camera to follow player
            const targetCameraX = this.player.x - this.canvas.width / 2;
            this.cameraX += (targetCameraX - this.cameraX) * 0.15;  // Faster, more responsive follow
            
            // Clamp camera with some freedom - allow looking ahead/behind
            const lookAhead = 200;  // Allow camera to go 200px beyond level start
            const lookBehind = 100; // Allow camera to go 100px beyond level end
            this.cameraX = Math.max(-lookAhead, Math.min(this.cameraX, this.levelWidth - this.canvas.width + lookBehind));
            this.timer++;
            this.drawBackground();
            this.drawGround();
            for (let ring of this.rings) ring.draw(this.ctx, this.cameraX);
            for (let enemy of this.enemies) enemy.draw(this.ctx, this.cameraX);
            // Draw platforms
            for (let platform of this.platforms) {
                platform.draw(this.ctx, this.cameraX);
            }
            // Draw springs
            for (let spring of this.springs) {
                spring.draw(this.ctx, this.cameraX);
            }
            // Draw goal
            this.goal.draw(this.ctx, this.cameraX);
            // Draw scattered rings
            for (let ring of this.scatteredRings) {
                ring.draw(this.ctx, this.cameraX);
            }
            this.player.draw();
            this.drawHUD();
            const bgMusic = this.assets.getAudio('bgMusic');
            if (bgMusic.paused) bgMusic.play();
            document.getElementById('playerImg').style.display = 'block';
        }
    } else if (this.state === 'gameover') {
        this.drawGameOver();
        document.getElementById('playerImg').style.display = 'none';
        this.assets.getAudio('bgMusic').pause();
        this.assets.getAudio('titleMusic').pause();
    } else if (this.state === 'levelcomplete') {
        this.drawLevelComplete();
        document.getElementById('playerImg').style.display = 'none';
        this.assets.getAudio('bgMusic').pause();
        this.assets.getAudio('titleMusic').pause();
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