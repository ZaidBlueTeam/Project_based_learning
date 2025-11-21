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
        zoneDisplayTimer: 3000  // Increased from 2005 to 3000ms for better visibility
    },

    enemy: {
        width: 35,
        height: 35,
        speed: 2,
        patrolDistance: 200
    },

    ring: {
        width: 20,
        height: 20,
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

    checkpoint: {
        width: 40,
        height: 80,
        color: 'yellow'
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
            sonicSpringUse: 'images/sonic_springuse.png',
            sonicDeath: 'images/sonic_dead.png',
            sonicHurt: 'images/sonic_hurt.png',
            sonic1GoalSign: 'images/sonic1_goal_sign.png',
            hellBossSprite: 'images/2011X_Groovin.gif',
            ringSprite: 'images/ring.gif',  // Add ring sprite (use a GIF for animation if desired)
            testZoneBossSprite: 'images/eggman_sprite.gif',  // Add Test Zone boss sprite
            invincibilityPowerUp: 'images/invincibilitybox.jpg',
            speedPowerUp: 'images/speedshoesbox.jpg',
            lifePowerUp: 'images/extralifebox.png',
            hill_sonicexe: 'images/hill_sonicexe.jpg',
        },
        audio: {
            titleMusic: 'audio/title.mp3',
            bgMusic: 'audio/green_hill.ogg',
            act1Music: 'audio/act1Music.ogg',
            act2Music: 'audio/act2Music.ogg',
            act3Music: 'audio/act3Music.ogg',
            bossMusic: 'audio/bossMusic.ogg',
            victoryMusic: 'audio/victoryMusic.ogg',
            gameCompleteMusic: 'audio/game_complete.ogg',
            gameOverMusic: 'audio/gameOverMusic.ogg', // Game over music (placeholder)
            jumpSound: 'audio/jump.wav',
            spindashSound: 'audio/spindash.wav',
            springSound: 'audio/spring.wav',
            hellAct1Music: 'audio/hillACT1.ogg',
            hellAct2Music: 'audio/hillACT2.ogg',
            invincibilityMusic: 'audio/invincibility.ogg',
            extraLifeSound: 'audio/ExtraLife.ogg',
            hellAct3Music: 'audio/hillACT3.ogg',
            hellBossMusic: 'audio/hillBOSS.wav'
        }
    },

    levels: {
        'Test Zone Act 1': {
            next: 'Test Zone Act 2',
            enemies: [
                { x: 400, y: 425 },
                { x: 700, y: 425 },
                { x: 1200, y: 425 },
                { x: 1600, y: 425 }
            ],
            rings: [
                { x: 150, y: 400 }, { x: 180, y: 400 }, { x: 210, y: 400 }, // Rings at start
                { x: 250, y: 400 }, { x: 300, y: 400 }, { x: 350, y: 400 },
                { x: 500, y: 450 }, { x: 550, y: 450 },
                { x: 600, y: 350 }, { x: 1000, y: 420 }, { x: 1100, y: 380 },
                { x: 1500, y: 440 }, { x: 1600, y: 400 }
            ],
            platforms: [
                { x: 800, y: 450, width: 150 },
                { x: 1100, y: 400, width: 100 },
                { x: 1400, y: 350, width: 120 },
                { x: 1800, y: 300, width: 200 },
                { x: 2200, y: 400, width: 150 },
                { x: 2500, y: 350, width: 100 },
                { x: 2800, y: 450, width: 120 },
                { x: 3200, y: 300, width: 180 }
            ],
            springs: [
                { x: 850, y: 430 },
                { x: 1450, y: 330 },
                { x: 2850, y: 430 }
            ],
            goal: { x: 3800, y: 425 },
            powerUps: [
                { x: 1000, y: 400, type: 'speed' },
                { x: 2400, y: 400, type: 'invincibility' },
                { x: 3600, y: 400, type: 'life' }
            ],
            checkpoints: [
                { x: 600, y: 425 },
                { x: 1800, y: 425 },
                { x: 3000, y: 425 }
            ],
            pits: [
                { x: 1200, width: 100 },
                { x: 2200, width: 120 },
                { x: 3400, width: 150 }
            ]
        },
        'Test Zone Act 2': {
            next: 'Test Zone Act 3',
            enemies: [
                { x: 500, y: 425 }, { x: 800, y: 425 }, { x: 1100, y: 425 },
                { x: 1400, y: 425 }, { x: 1700, y: 425 }, { x: 2000, y: 425 }
            ],
            rings: [
                { x: 300, y: 400 }, { x: 350, y: 400 }, { x: 400, y: 400 },
                { x: 600, y: 450 }, { x: 650, y: 450 }, { x: 700, y: 350 },
                { x: 900, y: 420 }, { x: 1000, y: 380 }, { x: 1200, y: 440 },
                { x: 1300, y: 400 }, { x: 1500, y: 350 }, { x: 1600, y: 420 },
                { x: 1800, y: 380 }, { x: 1900, y: 440 }, { x: 2100, y: 400 }
            ],
            platforms: [
                { x: 600, y: 450, width: 200 }, { x: 900, y: 400, width: 150 },
                { x: 1200, y: 350, width: 180 }, { x: 1500, y: 300, width: 220 },
                { x: 1800, y: 400, width: 160 }, { x: 2100, y: 350, width: 140 },
                { x: 2400, y: 450, width: 190 }, { x: 2700, y: 300, width: 200 },
                { x: 3000, y: 400, width: 170 }, { x: 3300, y: 350, width: 150 }
            ],
            springs: [
                { x: 650, y: 430 }, { x: 1250, y: 330 }, { x: 1850, y: 380 },
                { x: 2450, y: 430 }, { x: 3050, y: 380 }
            ],
            goal: { x: 3800, y: 425 },
            powerUps: [
                { x: 1200, y: 400, type: 'speed' },
                { x: 2200, y: 400, type: 'invincibility' },
                { x: 3200, y: 400, type: 'life' }
            ],
            checkpoints: [
                { x: 800, y: 425 },
                { x: 2000, y: 425 },
                { x: 3200, y: 425 }
            ],
            pits: [
                { x: 1500, width: 120 },
                { x: 2700, width: 150 },
                { x: 3500, width: 180 }
            ]
        },
        'Test Zone Act 3': {
            next: 'Hell.exe Act 1', // Continue to Hell.exe acts
            enemies: [], // No regular enemies in Act 3
            boss: { x: 3200, y: 350, sprite: 'testZoneBossSprite' }, // Eggman boss
            rings: [
                { x: 250, y: 400 }, { x: 300, y: 400 }, { x: 350, y: 400 },
                { x: 450, y: 450 }, { x: 500, y: 450 }, { x: 550, y: 350 },
                { x: 650, y: 420 }, { x: 700, y: 380 }, { x: 800, y: 440 },
                { x: 850, y: 400 }, { x: 950, y: 350 }, { x: 1000, y: 420 },
                { x: 1100, y: 380 }, { x: 1200, y: 440 }, { x: 1250, y: 400 },
                { x: 1350, y: 350 }, { x: 1400, y: 420 }, { x: 1500, y: 380 },
                { x: 1600, y: 440 }, { x: 1650, y: 400 }, { x: 1750, y: 350 }
            ],
            platforms: [
                { x: 500, y: 450, width: 250 }, { x: 800, y: 400, width: 200 },
                { x: 1100, y: 350, width: 220 }, { x: 1400, y: 300, width: 250 },
                { x: 1700, y: 400, width: 180 }, { x: 2000, y: 350, width: 160 },
                { x: 2300, y: 450, width: 210 }, { x: 2600, y: 300, width: 230 },
                { x: 2900, y: 400, width: 190 }, { x: 3200, y: 350, width: 170 },
                { x: 3500, y: 450, width: 200 }
            ],
            springs: [
                { x: 550, y: 430 }, { x: 1150, y: 330 }, { x: 1450, y: 280 },
                { x: 1750, y: 380 }, { x: 2350, y: 430 }, { x: 2650, y: 280 },
                { x: 2950, y: 380 }, { x: 3250, y: 330 }, { x: 3550, y: 430 }
            ]
        },
        'Hell.exe Act 1': {
            next: 'Hell.exe Act 2',
            enemies: [
                { x: 600, y: 425, type: 'exe' }, { x: 1200, y: 425, type: 'exe' }, { x: 1800, y: 425, type: 'exe' },
                { x: 2400, y: 425, type: 'exe' }, { x: 3000, y: 425, type: 'exe' }, { x: 3600, y: 425, type: 'exe' }
            ],
            rings: [
                { x: 200, y: 400 }, { x: 250, y: 400 }, { x: 300, y: 400 }, { x: 350, y: 400 }, { x: 400, y: 400 },
                { x: 800, y: 350 }, { x: 850, y: 350 }, { x: 900, y: 350 }, { x: 950, y: 350 }, { x: 1000, y: 350 },
                { x: 1600, y: 420 }, { x: 1650, y: 420 }, { x: 1700, y: 420 }, { x: 1750, y: 420 }, { x: 1800, y: 420 },
                { x: 2200, y: 400 }, { x: 2250, y: 400 }, { x: 2300, y: 400 }, { x: 2350, y: 400 }, { x: 2400, y: 400 },
                { x: 3000, y: 380 }, { x: 3050, y: 380 }, { x: 3100, y: 380 }, { x: 3150, y: 380 }, { x: 3200, y: 380 }
            ],
            platforms: [
                { x: 700, y: 350, width: 200 }, { x: 1300, y: 300, width: 180 }, { x: 1900, y: 250, width: 220 },
                { x: 2500, y: 350, width: 200 }, { x: 3100, y: 300, width: 180 }, { x: 3700, y: 250, width: 220 }
            ],
            springs: [
                { x: 750, y: 330 }, { x: 1350, y: 280 }, { x: 1950, y: 230 }, { x: 2550, y: 330 }, { x: 3150, y: 280 }
            ],
            pits: [
                { x: 1100, width: 100 }, { x: 2100, width: 120 }, { x: 3300, width: 150 }
            ],
            goal: { x: 3900, y: 425 },
            theme: {
                background: 'hill_sonicexe',
                music: 'hellAct1Music'
            },
            powerUps: [
                { x: 1000, y: 400, type: 'speed' },
                { x: 2000, y: 400, type: 'invincibility' },
                { x: 3000, y: 400, type: 'life' }
            ],
            checkpoints: [
                { x: 1000, y: 425 },
                { x: 2200, y: 425 },
                { x: 3400, y: 425 }
            ]
        },
        'Hell.exe Act 2': {
            width: 4200,  // Increase level width to allow reaching the goal at x: 4100
            next: 'Hell.exe Act 3',
            enemies: [
                { x: 800, y: 425, type: 'exe' }, { x: 1600, y: 425, type: 'exe' }, { x: 2400, y: 425, type: 'exe' },
                { x: 3200, y: 425, type: 'exe' }, { x: 3800, y: 425, type: 'exe' }
            ],
            rings: [
                { x: 400, y: 400 }, { x: 450, y: 400 }, { x: 500, y: 400 }, { x: 550, y: 400 }, { x: 600, y: 400 },
                { x: 1200, y: 350 }, { x: 1250, y: 350 }, { x: 1300, y: 350 }, { x: 1350, y: 350 }, { x: 1400, y: 350 },
                { x: 2000, y: 420 }, { x: 2050, y: 420 }, { x: 2100, y: 420 }, { x: 2150, y: 420 }, { x: 2200, y: 420 },
                { x: 2800, y: 400 }, { x: 2850, y: 400 }, { x: 2900, y: 400 }, { x: 2950, y: 400 }, { x: 3000, y: 400 }
            ],
            platforms: [
                { x: 900, y: 350, width: 220 }, { x: 1700, y: 300, width: 200 }, { x: 2500, y: 250, width: 240 },
                { x: 3300, y: 350, width: 220 }, { x: 3900, y: 300, width: 200 }
            ],
            springs: [
                { x: 950, y: 330 }, { x: 1750, y: 280 }, { x: 2550, y: 230 }, { x: 3350, y: 330 }
            ],
            pits: [
                { x: 1500, width: 120 }, { x: 2700, width: 150 }, { x: 3700, width: 180 }
            ],
            goal: { x: 4000, y: 425 },
            theme: {
                background: 'hill_sonicexe',
                music: 'hellAct2Music'
            },
            powerUps: [
                { x: 1200, y: 400, type: 'speed' },
                { x: 2400, y: 400, type: 'invincibility' },
                { x: 3600, y: 400, type: 'life' }
            ],
            checkpoints: [
                { x: 1200, y: 425 },
                { x: 2400, y: 425 },
                { x: 3600, y: 425 }
            ]
        },
        'Hell.exe Act 3': {
            next: null,
            enemies: [],
            boss: {
                x: 1200,
                y: 350,
                type: 'exeBoss',
                sprite: 'hellBossSprite', // Use your 2011 x sprite here
                music: 'hellBossMusic'
            },
            rings: [
                { x: 500, y: 400 }, { x: 550, y: 400 }, { x: 600, y: 400 }, { x: 650, y: 400 }, { x: 700, y: 400 },
                { x: 1200, y: 350 }, { x: 1250, y: 350 }, { x: 1300, y: 350 }, { x: 1350, y: 350 }, { x: 1400, y: 350 },
                { x: 2000, y: 420 }, { x: 2050, y: 420 }, { x: 2100, y: 420 }, { x: 2150, y: 420 }, { x: 2200, y: 420 },
                { x: 2800, y: 400 }, { x: 2850, y: 400 }, { x: 2900, y: 400 }, { x: 2950, y: 400 }, { x: 3000, y: 400 }
            ],
            platforms: [
                { x: 1000, y: 350, width: 220 }, { x: 1800, y: 300, width: 200 }, { x: 2600, y: 250, width: 240 },
                { x: 3400, y: 350, width: 220 }, { x: 4000, y: 300, width: 200 }
            ],
            springs: [
                { x: 1050, y: 330 }, { x: 1850, y: 280 }, { x: 2650, y: 230 }, { x: 3450, y: 330 }
            ],
            pits: [
                { x: 1600, width: 120 }, { x: 2800, width: 150 }, { x: 3900, width: 180 }
            ],
            theme: {
                background: 'hill_sonicexe',
                music: 'hellAct3Music'
            },
            boss: { x: 3200, y: 350, sprite: 'hellBossSprite', health: 12, music: 'hellBossMusic' }
        }
    }
};

class Player {
    constructor(assetManager) {
        // Ensure assetManager is defined (avoid parser issues with unexpected characters)
        assetManager = assetManager || null;

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
        this.isRolling = false; // Flag for rolling mode after spindash
        this.isSpringBouncing = false; // Flag for spring bounce animation
        this.springBounceTimer = 0; // Timer for how long spring animation lasts
        
        // Store asset manager reference
        this.assets = assetManager;

        // Jump control - prevent bunny hopping
        this.jumpKeyWasPressed = false;
        
        // Rings and lives system
        this.rings = 0;
        this.lives = CONFIG.playerSettings.startLives;
        this.isInvincible = false;
        this.invincibilityTimer = 0;
        this.isPowerInvincible = false;
        this.powerInvincibilityTimer = 0;
        this.isSpeedBoosted = false;
        this.speedBoostTimer = 0;
        this.isDead = false;
        this.deathAnimationFrame = 0;
        this.isDeathAnimating = false;
        this.deathAnimVy = 0;
        this.deathAnimTimer = 0;
        this.hurtTimer = 0;
    }

    get effectiveMaxSpeed() {
        return this.isSpeedBoosted ? this.maxSpeed * 1.5 : this.maxSpeed;
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

        // Spindash: Press 's' to crouch, hold to charge, release to dash
        // MUST be checked BEFORE horizontal movement to prevent moving while charging
        if (keys['s'] && this.onGround && !this.spindashMode) {
            // Can only START spindash if standing still (or moving very slowly)
            if (Math.abs(this.velocityX) < 0.5) {
                this.spindashMode = true;
                this.velocityX = 0; // Stop all movement
                this.animation = 'crouch';
                this.spindashTimer = 0;
                this.spindashCharge = 0;
                this.assets.getAudio('spindashSound').play();
            }
        } else if (keys['s'] && this.spindashMode) {
            // Charging - locked in place, can't move
            this.velocityX = 0; // Keep locked in place
            this.spindashCharge += 1;
            this.spindashTimer += 1;
            if (this.spindashTimer > CONFIG.player.spindashChargeFrames) {
                this.animation = 'spindash';
            }
        } else if (!keys['s'] && this.spindashMode && this.spindashCharge > 0) {
            // Release: Dash with jump animation
            this.velocityX = this.facing * CONFIG.player.spindashSpeed * (this.spindashCharge / 10);
            this.spindashCharge = 0;
            this.spindashTimer = 0;
            this.animation = 'jump';
            this.spindashMode = false;
            this.isRolling = true; // Enter rolling mode
        } else if (!keys['s'] && this.spindashMode) {
            // Cancelled spindash without charging
            this.spindashMode = false;
            this.spindashCharge = 0;
            this.spindashTimer = 0;
        }

        // Horizontal movement - BLOCKED during spindash charging
        if (!this.spindashMode) {
            if (keys['a']) {
                this.velocityX -= this.acceleration;
                if (!this.isRolling && this.velocityX < -this.effectiveMaxSpeed) this.velocityX = -this.effectiveMaxSpeed;
                this.facing = -1;
            } else if (keys['d']) {
                this.velocityX += this.acceleration;
                if (!this.isRolling && this.velocityX > this.effectiveMaxSpeed) this.velocityX = this.effectiveMaxSpeed;
                this.facing = 1;
            } else {
                if (!this.isRolling) {
                    this.velocityX *= CONFIG.player.friction;
                }
            }
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

        // Apply horizontal velocity
        this.x += this.velocityX;

        // Boss arena invisible walls
        if (game.bossCameraLocked) {
            const arenaLeft = game.cameraX;
            const arenaRight = game.cameraX + game.canvas.width;
            if (this.x < arenaLeft) {
                this.x = arenaLeft;
                this.velocityX = 0;
            }
            if (this.x + this.width > arenaRight) {
                this.x = arenaRight - this.width;
                this.velocityX = 0;
            }
        }

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
        
        // Check pit death
        if (!this.onGround && this.y + this.height >= ground.y) {
            for (let pit of game.pits) {
                if (this.x + this.width > pit.x && this.x < pit.x + pit.width) {
                    // Fell into pit - instant death
                    this.die(game);
                    break;
                }
            }
        }
        
        // Clear rolling flag when slowing down (not when landing!)
        if (this.isRolling && Math.abs(this.velocityX) < 2) {
            this.isRolling = false;
        }

        // Spring collision
        for (let spring of game.springs) {
            if (spring.checkCollision(this)) {
                spring.bounce(this);  // Use the spring's bounce method with all the effects!
                break;  // Only bounce on one spring
            }
        }

        // Level boundary collision only - camera handles screen positioning
        if (this.x < 0) {
            this.x = 0;
            this.velocityX = Math.max(0, this.velocityX);
            if (this.animation === 'jump') {
                this.animation = 'idle';
                this.spindashMode = false;
                this.spindashTimer = 0;
            }
        }
        // Clamp to level end only - camera will handle screen positioning
        if (this.x + this.width > game.levelWidth) {
            this.x = game.levelWidth - this.width;
            this.velocityX = Math.min(0, this.velocityX);
            if (this.animation === 'jump') {
                this.animation = 'idle';
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
        if (this.spindashMode) {
            // Keep spindash states
        } else if (this.isSpringBouncing) {
            // Keep jump animation during spring bounce
            this.animation = 'jump';
        } else if (this.isRolling) {
            // Keep jump animation during rolling for enemy killing
            this.animation = 'jump';
        } else if (!this.onGround) {
            this.animation = 'jump';
        } else if (Math.abs(this.velocityX) > this.effectiveMaxSpeed * 0.8) {
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

        // Handle power-up invincibility timer
        if (this.isPowerInvincible) {
            this.powerInvincibilityTimer--;
            if (this.powerInvincibilityTimer <= 0) {
                this.isPowerInvincible = false;
                // Switch back to normal music
                game.switchBackToNormalMusic();
            }
        }

        // Handle speed boost timer
        if (this.isSpeedBoosted) {
            this.speedBoostTimer--;
            if (this.speedBoostTimer <= 0) {
                this.isSpeedBoosted = false;
                // Reset music speed
                game.resetMusicSpeed();
            }
        }

        // Handle hurt timer
        if (this.hurtTimer > 0) {
            this.hurtTimer--;
            if (this.hurtTimer === 0) {
                this.makeInvincible();
            }
        }
        
        // Handle spring bounce timer
        if (this.springBounceTimer > 0) {
            this.springBounceTimer--;
            if (this.springBounceTimer === 0) {
                this.isSpringBouncing = false;
            }
        }
    }

    draw(ctx, cameraX) {
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
        } else if (this.isSpringBouncing) {
            src = CONFIG.assets.images.sonicSpringUse;
            console.log('🎨 Using spring sprite!', src);
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
        // Only change src if animation actually changed to avoid interrupting GIF playback
        // Compare the end of the current src with the new src to avoid full URL mismatch
        if (!playerImg.src.endsWith(src)) {
            playerImg.src = src;
        }
        // Position relative to game container, accounting for camera offset
        const gameContainer = document.getElementById('gameContainer');
        const containerRect = gameContainer.getBoundingClientRect();
        const canvasRect = gameContainer.querySelector('canvas').getBoundingClientRect();

        // Calculate position relative to canvas (world position - camera offset)
        const relativeX = this.x - cameraX;
        const relativeY = this.y;

        playerImg.style.position = 'absolute';
        playerImg.style.left = (canvasRect.left - containerRect.left + relativeX) + 'px';
        playerImg.style.top = (canvasRect.top - containerRect.top + relativeY) + 'px';
        playerImg.style.width = this.width + 'px';
        playerImg.style.height = this.height + 'px';
        playerImg.style.pointerEvents = 'none';

        // Draw invincibility stars
        if (this.isPowerInvincible) {
            ctx.save();
            ctx.fillStyle = 'yellow';
            for (let i = 0; i < 6; i++) {
                const angle = (i / 6) * Math.PI * 2 + Date.now() * 0.005;
                const dist = 25;
                const x = relativeX + this.width / 2 + Math.cos(angle) * dist;
                const y = relativeY + this.height / 2 + Math.sin(angle) * dist;
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
        playerImg.style.zIndex = '10';

        if (this.facing < 0) {
            playerImg.style.transform = 'scaleX(-1)';
        } else {
            playerImg.style.transform = 'scaleX(1)';
        }
    }
    
    collectRing() {
        this.rings++;
        console.log(`💍 Collected ring! Total: ${this.rings}`);
    }
    
    loseRings(game) {
        if (this.rings > 0) {
            console.log(`💍 Losing ${this.rings} rings! Scattering...`);
            // Limit scattered rings to 32 (like real Sonic games)
            const ringsToScatter = Math.min(this.rings, 32);
            
            // Scatter rings in random directions
            for (let i = 0; i < ringsToScatter; i++) {
                // Random angle and speed
                const angle = (Math.PI * 2 * i) / ringsToScatter;  // Evenly spread
                const speed = 3 + Math.random() * 2;  // 3-5 pixels/frame
                const velocityX = Math.cos(angle) * speed;
                const velocityY = Math.sin(angle) * speed - 2;  // Slight upward
                
                // Create scattered ring at player position
                const scatteredRing = new ScatteredRing(
                    this.x + this.width / 2,
                    this.y + this.height / 2,
                    velocityX,
                    velocityY,
                    this.assets
                );
                game.scatteredRings.push(scatteredRing);
            }
            console.log(`✅ Scattered ${ringsToScatter} rings! Total in array:`, game.scatteredRings.length);
            this.rings = 0;
            this.makeInvincible();
        } else {
            this.die(game);
        }
    }
    
    makeInvincible() {
        this.isInvincible = true;
        this.invincibilityTimer = CONFIG.playerSettings.invincibilityFrames;
    }
    
    applyInvincibilityPowerUp() {
        this.isPowerInvincible = true;
        this.powerInvincibilityTimer = 1200; // 20 seconds at 60fps
    }
    
    addLife() {
        this.lives++;
    }
    
    applySpeedBoost() {
        this.isSpeedBoosted = true;
        this.speedBoostTimer = 1200; // 20 seconds at 60fps
    }
    
    die(game) {
        this.lives--;
        this.isDeathAnimating = true;
        this.deathAnimTimer = 0;
        this.deathAnimVy = 0;
        // Pause music during death animation
        if (game && game.currentMusic) {
            try {
                game.currentMusic.pause();
            } catch (e) {
                // Ignore pause errors
            }
        }
        // Play death sound if you have one: this.assets.getAudio('deathSound')?.play();
        // Don't set isDead yet; wait for animation to finish
        console.log('Sonic died! Lives remaining:', this.lives);
    }
    
    respawn(game) {
        // Respawn at checkpoint if available, otherwise at start
        this.x = game.checkpointX !== undefined ? game.checkpointX : CONFIG.player.startX;
        this.y = game.checkpointY !== undefined ? game.checkpointY : CONFIG.player.startY;
        this.velocityX = 0;
        this.velocityY = 0;
        this.rings = 0;
        this.isDead = false;
        this.hurtTimer = 0;
        this.isRolling = false; // Clear rolling flag on respawn
        this.makeInvincible();
    }
    
    takeDamage(game) {
        if (this.isInvincible || this.isPowerInvincible || this.hurtTimer > 0) return;
        console.log('Player took damage! Rings before:', this.rings);
        if (this.rings > 0) {
            this.loseRings(game);
            console.log('Rings after damage:', this.rings);
            // Knockback
            this.velocityX = -this.facing * CONFIG.playerSettings.knockbackForce;
            this.velocityY = -5;
            // Hurt animation
            this.hurtTimer = 30; // 0.5 seconds at 60fps
        } else {
            // No rings, die
            this.isDead = true;
            this.isDeathAnimating = true;
            this.deathAnimVy = -10;
            this.deathAnimTimer = 0;
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
    
    draw(ctx, cameraX) {
        if (!this.isAlive) return;
        
        // Draw enemy as red rectangle (we'll add sprites later)
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);
        
        // Draw eyes (adjusted for smaller hitbox)
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x - cameraX + 7, this.y + 7, 7, 7);
        ctx.fillRect(this.x - cameraX + 21, this.y + 7, 7, 7);
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x - cameraX + 10, this.y + 10, 4, 4);
        ctx.fillRect(this.x - cameraX + 24, this.y + 10, 4, 4);
    }
    
    checkCollision(player) {
        if (!this.isAlive) return false;
        
        // Shrink hitbox by 5 pixels on each side for more forgiving collision
        const buffer = 5;
        const enemyLeft = this.x + buffer;
        const enemyRight = this.x + this.width - buffer;
        const enemyTop = this.y + buffer;
        const enemyBottom = this.y + this.height - buffer;
        
        const playerLeft = player.x + buffer;
        const playerRight = player.x + player.width - buffer;
        const playerTop = player.y + buffer;
        const playerBottom = player.y + player.height - buffer;
        
        return playerLeft < enemyRight &&
               playerRight > enemyLeft &&
               playerTop < enemyBottom &&
               playerBottom > enemyTop;
    }
    
    destroy() {
        this.isAlive = false;
    }
}

// ============================
// BOSS CLASS (Eggman)
// ============================
class Boss {
    constructor(config, assets) {
        this.x = config.x;
        this.y = config.y;
        this.sprite = config.sprite || null;
        this.music = config.music || null;
        this.assets = assets;
        this.width = 80;  // Bigger than regular enemies
        this.height = 60;
        this.speed = 4.0; // Increased from 3.0 for more noticeable movement
        
        // Create HTML img element for animation
        this.img = document.createElement('img');
        this.img.style.position = 'absolute';
        this.img.style.pointerEvents = 'none';
        this.img.style.zIndex = '6';  // Above canvas (canvas is 5)
        document.getElementById('gameContainer').appendChild(this.img);
        
        // Movement
        this.startX = this.x;
        this.direction = 1;  // 1 = right, -1 = left
        this.patrolDistance = 500; // Increased from 300 for wider movement range
        
        // State
        this.isAlive = true;
        this.health = config.health || 8; // Takes hits to defeat
        
        // Attack
        this.shootTimer = 0;
        this.shootCooldown = 120; // Shoot every 2 seconds (60fps)
        this.projectiles = [];
        
        // Animation
        this.animationFrame = 0;
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
        
        // Keep boss within arena bounds (don't go off-screen during boss fight)
        // Boss starts at x=3200, arena is approximately 2700-3900 (expanded for better movement)
        if (this.x < 2700) {
            this.x = 2700;
            this.direction = 1;
        }
        if (this.x + this.width > 3900) {
            this.x = 3900 - this.width;
            this.direction = -1;
        }
        
        // Shooting logic
        this.shootTimer++;
        if (this.shootTimer >= this.shootCooldown) {
            this.shoot();
            this.shootTimer = 0;
        }
        
        // Update projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            projectile.update();
            
            // Remove projectiles that are off screen or inactive
            if (projectile.x < -100 || projectile.x > 4200 || !projectile.active) {
                this.projectiles.splice(i, 1);
            }
        }
        
        // Animation
        this.animationFrame++;
    }
    
    shoot() {
        // Shoot projectiles in multiple directions
        const centerX = this.x + this.width / 2;
        const startY = this.y + this.height;
        
        // Shoot left, center, right
        this.projectiles.push(new BossProjectile(centerX, startY, -2, 3)); // Left
        this.projectiles.push(new BossProjectile(centerX, startY, 0, 3));  // Center
        this.projectiles.push(new BossProjectile(centerX, startY, 2, 3));  // Right
    }
    
    draw(ctx, cameraX) {
        if (!this.isAlive) {
            this.img.style.display = 'none';
            return;
        } else {
            this.img.style.display = 'block';
        }
        
        if (this.sprite) {
            // Set img src if changed
            const path = CONFIG.assets.images[this.sprite];
            if (!this.img.src.endsWith(path)) {
                this.img.src = path;
            }
            
            // Position the img element
            const relativeX = this.x - cameraX;
            const relativeY = this.y;
            this.img.style.left = relativeX + 'px';
            this.img.style.top = relativeY + 'px';
            this.img.style.width = this.width + 'px';
            this.img.style.height = this.height + 'px';
        } else {
            // Fallback to default if no sprite
            this.img.style.display = 'none';
            this.drawDefault(ctx, cameraX);
        }
        
        // Draw health bar
        const barWidth = 60;
        const barHeight = 6;
        const barX = this.x - cameraX + 10;
        const barY = this.y - 15;
        
        // Background
        ctx.fillStyle = 'black';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Health
        ctx.fillStyle = 'red';
        const healthWidth = (this.health / 8) * barWidth;
        ctx.fillRect(barX, barY, healthWidth, barHeight);
        
        // Border
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
        
        // Draw projectiles
        for (const projectile of this.projectiles) {
            if (projectile.active) {
                projectile.draw(ctx, cameraX);
            }
        }
    }
    
    drawDefault(ctx, cameraX) {
        // Draw Eggman's vehicle as a gray egg shape (default)
        ctx.fillStyle = 'gray';
        ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);
        
        // Draw red details (Eggman's face area)
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x - cameraX + 10, this.y + 10, 20, 15);
        ctx.fillRect(this.x - cameraX + 50, this.y + 10, 20, 15);
        
        // Draw eyes
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x - cameraX + 15, this.y + 15, 6, 6);
        ctx.fillRect(this.x - cameraX + 55, this.y + 15, 6, 6);
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x - cameraX + 17, this.y + 17, 3, 3);
        ctx.fillRect(this.x - cameraX + 57, this.y + 17, 3, 3);
    }
    
    checkCollision(player) {
        if (!this.isAlive) return false;
        
        const bossLeft = this.x;
        const bossRight = this.x + this.width;
        const bossTop = this.y;
        const bossBottom = this.y + this.height;
        
        const playerLeft = player.x;
        const playerRight = player.x + player.width;
        const playerTop = player.y;
        const playerBottom = player.y + player.height;
        
        return playerLeft < bossRight &&
               playerRight > bossLeft &&
               playerTop < bossBottom &&
               playerBottom > bossTop;
    }
    
    takeDamage() {
        this.health--;
        if (this.health <= 0) {
            this.destroy();
        }
    }
    
    destroy() {
        this.isAlive = false;
        this.img.remove();
        // Create explosion effect or victory animation
    }
}

// ============================
// BOSS PROJECTILE CLASS
// ============================
class BossProjectile {
    constructor(x, y, velocityX, velocityY) {
        this.x = x;
        this.y = y;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.width = 8;
        this.height = 8;
        this.active = true;
    }
    
    update() {
        if (!this.active) return;
        
        this.x += this.velocityX;
        this.y += this.velocityY;
    }
    
    draw(ctx, cameraX) {
        if (!this.active) return;
        
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);
        
        // Add glow effect
        ctx.strokeStyle = 'orange';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x - cameraX - 1, this.y - 1, this.width + 2, this.height + 2);
    }
    
    checkCollision(player) {
        if (!this.active) return false;
        
        return player.x < this.x + this.width &&
               player.x + player.width > this.x &&
               player.y < this.y + this.height &&
               player.y + player.height > this.y;
    }
    
    destroy() {
        this.active = false;
    }
}

// ============================
// RING CLASS
// ============================
class Ring {
    constructor(x, y, assets) {
        this.x = x;
        this.y = y;
        this.assets = assets;
        this.width = CONFIG.ring.width;
        this.height = CONFIG.ring.height;
        this.collected = false;
        this.animationFrame = 0;
        
        // Create HTML img element for animation
        this.img = document.createElement('img');
        this.img.src = 'images/ring.gif';
        this.img.style.position = 'absolute';
        this.img.style.pointerEvents = 'none';
        this.img.style.zIndex = '6';
        document.getElementById('gameContainer').appendChild(this.img);
    }
    
    update() {
        if (this.collected) return;
        this.animationFrame = (this.animationFrame + 0.2) % 360;
    }
    
    draw(ctx, cameraX) {
        if (this.collected) return;
        
        // Position the img element
        const relativeX = this.x - cameraX;
        const relativeY = this.y;
        this.img.style.left = relativeX + 'px';
        this.img.style.top = relativeY + 'px';
        this.img.style.width = this.width + 'px';
        this.img.style.height = this.height + 'px';
        this.img.style.display = 'block';
    }
    
    checkCollision(player) {
        if (this.collected) return false;
        
        return player.x < this.x + this.width &&
               player.x + player.width > this.x &&
               player.y < this.y + this.height &&
               player.y + player.height > this.y;
    }
    
    collect() {
        this.img.remove();
        this.collected = true;
    }
}

class ScatteredRing {
    constructor(x, y, velocityX, velocityY, assets) {
        this.x = x;
        this.y = y;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.assets = assets;
        this.width = CONFIG.ring.width;
        this.height = CONFIG.ring.height;
        this.collected = false;
        this.animationFrame = 0;
        this.lifetime = 256;  // About 4 seconds at 60fps (like real Sonic)
        this.canBeCollected = false; // Can't collect immediately after scattering
        this.collectionDelay = 30; // 0.5 seconds at 60fps before you can collect
        
        // Create HTML img element for animation
        this.img = document.createElement('img');
        this.img.src = 'images/ring.gif';
        this.img.style.position = 'absolute';
        this.img.style.pointerEvents = 'none';
        this.img.style.zIndex = '6';
        document.getElementById('gameContainer').appendChild(this.img);
    }

    update(groundY) {
        if (this.collected) return;
        
        // Apply gravity (rings fall down)
        this.velocityY += 0.4;
        
        // Move
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // Ground collision with bounce
        if (this.y + this.height >= groundY) {
            this.y = groundY - this.height;
            this.velocityY = -this.velocityY * 0.75; // Bounce with 75% energy
            this.velocityX *= 0.85; // Friction on ground
            
            // Stop bouncing if velocity is too low
            if (Math.abs(this.velocityY) < 1) {
                this.velocityY = 0;
            }
        }
        
        // Air friction
        this.velocityX *= 0.98;
        
        // Rotate for animation
        this.animationFrame = (this.animationFrame + 0.2) % 360;
        
        // Countdown collection delay
        if (!this.canBeCollected && this.collectionDelay > 0) {
            this.collectionDelay--;
            if (this.collectionDelay <= 0) {
                this.canBeCollected = true;
            }
        }
        
        // Countdown lifetime
        this.lifetime--;
        if (this.lifetime <= 0) {
            this.img.remove();
            this.collected = true;  // Remove after time
        }
    }

    collect() {
        this.img.remove();
        this.collected = true;
    }

    draw(ctx, cameraX) {
        if (this.collected) return;
        
        // Position the img element
        const relativeX = this.x - cameraX;
        const relativeY = this.y;
        this.img.style.left = relativeX + 'px';
        this.img.style.top = relativeY + 'px';
        this.img.style.width = this.width + 'px';
        this.img.style.height = this.height + 'px';
        this.img.style.display = 'block';
    }

    checkCollision(player) {
        if (this.collected || !this.canBeCollected) return false;
        
        return player.x < this.x + this.width &&
               player.x + player.width > this.x &&
               player.y < this.y + this.height &&
               player.y + player.height > this.y;
    }
}

// ============================
// POWERUP CLASS
// ============================
class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type; // 'speed', 'invincibility', 'life'
        this.width = 30;
        this.height = 30;
        this.collected = false;
    }

    checkCollision(player) {
        return player.x < this.x + this.width &&
               player.x + player.width > this.x &&
               player.y < this.y + this.height &&
               player.y + player.height > this.y;
    }

    draw(ctx, cameraX, game) {
        if (this.collected) return;

        // Draw power-up sprite
        let spriteName;
        if (this.type === 'speed') spriteName = 'speedPowerUp';
        else if (this.type === 'invincibility') spriteName = 'invincibilityPowerUp';
        else if (this.type === 'life') spriteName = 'lifePowerUp';
        
        const sprite = game.assets.getImage(spriteName);
        if (sprite) {
            ctx.drawImage(sprite, this.x - cameraX, this.y, this.width, this.height);
        } else {
            // Fallback: draw colored box with text label
            ctx.fillStyle = this.type === 'speed' ? 'blue' : this.type === 'invincibility' ? 'yellow' : 'green';
            ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);
            
            // Add text label
            ctx.fillStyle = 'white';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            const label = this.type === 'speed' ? 'SPD' : this.type === 'invincibility' ? 'INV' : 'LIFE';
            ctx.fillText(label, this.x - cameraX + this.width / 2, this.y + this.height / 2 + 4);
            ctx.textAlign = 'left'; // Reset text alignment
        }

        // Check for collection (only if jumping or spindashing)
        if (this.checkCollision(game.player)) {
            const isJumpingDown = !game.player.onGround && game.player.velocityY > 0;
            const isRolling = game.player.isRolling;
            if (isJumpingDown || isRolling) {
                this.collected = true;
                game.applyPowerUp(this.type);
            }
        }
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
            player.y + player.height <= this.y + 20 &&  // Close to platform top (increased from 10)
            player.y + player.height >= this.y - 5 &&   // Allow slight penetration (changed from >= this.y)
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
        this.cooldown = 0;        // Cooldown timer
        this.maxCooldown = 30;    // 0.5 seconds at 60fps
    }
    
    update() {
        if (this.isBouncing) {
            this.animationFrame++;
            if (this.animationFrame > 10) {  // Animation lasts 10 frames
                this.isBouncing = false;
                this.animationFrame = 0;
            }
        }
        
        // Countdown cooldown timer
        if (this.cooldown > 0) {
            this.cooldown--;
        }
    }
    
    draw(ctx, cameraX) {
        // Change color when on cooldown
        if (this.cooldown > 0) {
            ctx.fillStyle = 'gray';  // Gray when on cooldown
        } else {
            ctx.fillStyle = CONFIG.spring.color;  // Yellow when ready
        }
        ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);
        
        // Draw spring coils (compress when bouncing)
        ctx.fillStyle = 'black';
        const coilHeight = this.isBouncing ? 5 : 10;  // Compress when bouncing
        for (let i = 0; i < 3; i++) {
            ctx.fillRect(this.x - cameraX + 5 + i * 10, this.y + 5, 5, coilHeight);
        }
        
        // Add visual indicator for cooldown
        if (this.cooldown > 0) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);
        }
    }
    
    checkCollision(player) {
        // Can't use spring during cooldown
        if (this.cooldown > 0) return false;
        
        return player.x < this.x + this.width &&
               player.x + player.width > this.x &&
               player.y < this.y + this.height &&
               player.y + player.height > this.y;
    }
    
    bounce(player) {
        player.velocityY = this.bounceStrength;  // Launch up!
        player.onGround = false;
        this.isBouncing = true;  // Trigger spring visual animation
        
        // Trigger Sonic's spring bounce animation
        player.isSpringBouncing = true;
        player.springBounceTimer = 20; // Show spring animation for ~0.33 seconds
        console.log('🎯 Spring bounce! isSpringBouncing:', player.isSpringBouncing, 'cooldown:', this.maxCooldown);
        
        // Start cooldown
        this.cooldown = this.maxCooldown;
        
        // Play spring sound
        const springAudio = player.assets.getAudio('springSound');
        if (springAudio) springAudio.play();
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
        // Draw Sonic 1 goal sign sprite using asset manager
        const img = assetManager.getImage('sonic1GoalSign');
        if (img) {
            ctx.drawImage(img, this.x - cameraX, this.y, this.width, this.height);
        } else {
            // Fallback: draw a placeholder rectangle
            ctx.fillStyle = CONFIG.goal.color;
            ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);
        }
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

// ============================
// CHECKPOINT CLASS
// ============================
class Checkpoint {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.checkpoint.width;
        this.height = CONFIG.checkpoint.height;
        this.activated = false;
    }
    
    draw(ctx, cameraX) {
        // Draw checkpoint flag - yellow when inactive, green when activated
        ctx.fillStyle = this.activated ? '#00FF00' : CONFIG.checkpoint.color;
        ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);
        
        // Draw flag pole
        ctx.fillStyle = '#8B4513'; // Brown pole
        ctx.fillRect(this.x - cameraX + this.width/2 - 2, this.y + this.height, 4, 20);
        
        // Draw flag
        ctx.fillStyle = this.activated ? '#00FF00' : '#FFFF00';
        ctx.beginPath();
        ctx.moveTo(this.x - cameraX + this.width/2, this.y + this.height - 5);
        ctx.lineTo(this.x - cameraX + this.width/2 + 15, this.y + this.height - 10);
        ctx.lineTo(this.x - cameraX + this.width/2, this.y + this.height - 15);
        ctx.closePath();
        ctx.fill();
    }
    
    update() {
        // Checkpoint doesn't need animation
    }
    
    checkCollision(player) {
        return player.x < this.x + this.width &&
               player.x + player.width > this.x &&
               player.y < this.y + this.height &&
               player.y + player.height > this.y;
    }
    
    activate() {
        this.activated = true;
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
            console.log('Loading audio:', name, src);
            const audio = new Audio();
            audio.oncanplaythrough = () => {
                console.log('Loaded audio:', name);
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

    drawZone() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '48px Arial';
        
        // Show full level name with act number
        this.ctx.fillText(this.currentLevel, this.canvas.width / 2 - 200, this.canvas.height / 2);
    }

    drawGameComplete() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'gold';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.fillText('GAME COMPLETE!', this.canvas.width / 2 - 200, this.canvas.height / 2 - 60);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`Final Score: ${this.score.toLocaleString()}`, this.canvas.width / 2 - 100, this.canvas.height / 2);
        this.ctx.fillText('Congratulations!', this.canvas.width / 2 - 100, this.canvas.height / 2 + 40);
        this.ctx.fillText('Press R to Play Again', this.canvas.width / 2 - 100, this.canvas.height / 2 + 80);
    }
    
    drawLevelComplete() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'gold';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.fillText('LEVEL COMPLETE!', this.canvas.width / 2 - 200, this.canvas.height / 2 - 60);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`Time: ${this.formatTime(this.timer)}`, this.canvas.width / 2 - 80, this.canvas.height / 2 - 10);
        this.ctx.fillText(`Rings: ${this.player.rings}`, this.canvas.width / 2 - 60, this.canvas.height / 2 + 20);
        
        // Show score breakdown
        const timeBonus = Math.max(0, 50000 - this.timer * 10);
        const ringBonus = this.player.rings * 100;
        this.ctx.fillText(`Time Bonus: ${timeBonus.toLocaleString()}`, this.canvas.width / 2 - 120, this.canvas.height / 2 + 50);
        this.ctx.fillText(`Ring Bonus: ${ringBonus.toLocaleString()}`, this.canvas.width / 2 - 110, this.canvas.height / 2 + 80);
        this.ctx.fillStyle = 'yellow';
        this.ctx.fillText(`Total Score: ${this.score.toLocaleString()}`, this.canvas.width / 2 - 100, this.canvas.height / 2 + 110);
        
        this.ctx.fillStyle = 'white';
        this.ctx.fillText('Press R to Restart', this.canvas.width / 2 - 100, this.canvas.height / 2 + 140);
    }
    
    drawVictory() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'gold';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.fillText('ACT COMPLETE!', this.canvas.width / 2 - 180, this.canvas.height / 2 - 60);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`Time: ${this.formatTime(this.timer)}`, this.canvas.width / 2 - 80, this.canvas.height / 2 - 10);
        this.ctx.fillText(`Rings: ${this.player.rings}`, this.canvas.width / 2 - 60, this.canvas.height / 2 + 20);
        
        // Show score breakdown
        const timeBonus = Math.max(0, 50000 - this.timer * 10);
        const ringBonus = this.player.rings * 100;
        this.ctx.fillText(`Time Bonus: ${timeBonus.toLocaleString()}`, this.canvas.width / 2 - 120, this.canvas.height / 2 + 50);
        this.ctx.fillText(`Ring Bonus: ${ringBonus.toLocaleString()}`, this.canvas.width / 2 - 110, this.canvas.height / 2 + 80);
        this.ctx.fillStyle = 'yellow';
        this.ctx.fillText(`Total Score: ${this.score.toLocaleString()}`, this.canvas.width / 2 - 100, this.canvas.height / 2 + 110);
        
        this.ctx.fillStyle = 'white';
        this.ctx.fillText('Advancing to next act...', this.canvas.width / 2 - 120, this.canvas.height / 2 + 140);
    }
    
    formatTime(frames) {
        const totalSeconds = Math.floor(frames / 60);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Database integration methods
    async loadProgress(levelName) {
        try {
            const response = await fetch(`http://localhost:3000/api/progress/${encodeURIComponent(levelName)}`);
            if (response.ok) {
                const progress = await response.json();
                this.player.lives = progress.lives;
                this.score = progress.score || 0;
                this.serverAvailable = true; // Server is available
                console.log(`📥 Loaded progress for ${levelName}: ${this.player.lives} lives, ${this.score} score`);
            } else {
                console.log(`📝 No saved progress for ${levelName}, using defaults`);
                this.player.lives = 3;
                this.score = 0;
                this.serverAvailable = true; // Server responded, just no data
            }
        } catch (error) {
            console.warn('⚠️  Server not available - playing in offline mode');
            console.log('💡 To enable progress saving, start the backend server:');
            console.log('   cd sonic-backend && npm install && node server.js');
            this.serverAvailable = false; // Server is not available
            // Use defaults if loading fails
            this.player.lives = 3;
            this.score = 0;
        }
    }

    async saveProgress(levelName) {
        try {
            const response = await fetch('http://localhost:3000/api/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    level_name: levelName,
                    lives: this.player.lives,
                    score: this.score
                })
            });
            if (response.ok) {
                console.log(`💾 Saved progress for ${levelName}: ${this.player.lives} lives, ${this.score} score`);
            }
        } catch (error) {
            console.warn('⚠️  Server not available - progress not saved');
            console.log('💡 Start the backend server to enable progress saving');
        }
    }

    loadLevelData(levelName) {
        const levelData = CONFIG.levels[levelName];
        if (!levelData) return;

        // Clear power-up effects at the start of each act (but not temporary post-hit invincibility)
        this.player.isSpeedBoosted = false;
        this.player.speedBoostTimer = 0;
        this.player.isPowerInvincible = false;
        this.player.powerInvincibilityTimer = 0;

        // Reset checkpoint for new level
        this.checkpointX = undefined;
        this.checkpointY = undefined;

        // Clear old scattered rings from previous levels and remove their DOM elements
        for (let ring of this.scatteredRings) {
            if (ring.img) ring.img.remove();
        }
        this.scatteredRings = [];

        // Clear old rings from previous levels and remove their DOM elements
        for (let ring of this.rings || []) {
            if (ring.img) ring.img.remove();
        }
        this.rings = [];

        // Set current background
        this.currentBackground = levelData.theme ? levelData.theme.background : 'background';

        // Set level width (use level-specific if available, else default)
        this.levelWidth = levelData.width || CONFIG.level.width;

        // Set ground color based on act
        if (levelName.includes('Act 1')) {
            this.ground.color = '#8B4513'; // Brown
        } else if (levelName.includes('Act 2')) {
            this.ground.color = '#228B22'; // Green
        } else if (levelName.includes('Act 3')) {
            this.ground.color = '#8B008B'; // Purple
        } else {
            this.ground.color = '#8B4513'; // Default brown
        }

        // Create enemies
        this.enemies = levelData.enemies.map(e => 
            new Enemy(e.x, this.ground.y - CONFIG.enemy.height)
        );

        // Create boss (if level has one)
        this.boss = levelData.boss ? new Boss(levelData.boss, this.assets) : null;

        // Create rings
        this.rings = levelData.rings.map(r => new Ring(r.x, r.y, this.assets));

        // Create power-ups
        this.powerUps = (levelData.powerUps || []).map(p => new PowerUp(p.x, p.y, p.type));

        // Create platforms
        this.platforms = levelData.platforms.map(p => 
            new Platform(p.x, p.y, p.width)
        );

        // Create springs
        this.springs = levelData.springs.map(s => new Spring(s.x, s.y));

        // Add this line to initialize pits
        this.pits = levelData.pits || [];

        // Create goal (if level has one)
        this.goal = levelData.goal ? new Goal(levelData.goal.x, this.ground.y - CONFIG.goal.height) : null;

        // Create checkpoints (if level has them)
        this.checkpoints = (levelData.checkpoints || []).map(c => new Checkpoint(c.x, this.ground.y - CONFIG.checkpoint.height));

        // Don't auto-start boss fight - wait for player to reach boss area
        // Boss fight will be triggered when player reaches boss position

        // Switch to appropriate music for this level (only if not in title state)
        if (this.state !== 'title') {
            this.switchMusicForLevel(levelName);
        }
    }

    // Switch to appropriate music for current level
    switchMusicForLevel(levelName) {
        // Prevent concurrent music switching
        if (this.musicSwitching) return;
        this.musicSwitching = true;

        // Stop current music safely
        if (this.currentMusic) {
            try {
                this.currentMusic.pause();
                this.currentMusic.currentTime = 0;
            } catch (e) {
                // Ignore errors if music is already stopped
            }
        }

        // Force stop any boss music if not in boss fight
        if (!this.isBossFight) {
            const bossMusic = this.assets.getAudio('bossMusic');
            if (bossMusic && !bossMusic.paused) {
                try {
                    bossMusic.pause();
                    bossMusic.currentTime = 0;
                } catch (e) {}
            }
            const hellBossMusic = this.assets.getAudio('hellBossMusic');
            if (hellBossMusic && !hellBossMusic.paused) {
                try {
                    hellBossMusic.pause();
                    hellBossMusic.currentTime = 0;
                } catch (e) {}
            }
        }

        let musicName;
        const levelData = CONFIG.levels[levelName];
        if (this.isBossFight) {
            // Use boss-specific music if defined, else default boss music
            musicName = levelData.boss && levelData.boss.music ? levelData.boss.music : 'bossMusic';
        } else if (levelData.theme && levelData.theme.music) {
            // Use theme music if defined
            musicName = levelData.theme.music;
        } else if (levelName === 'Test Zone Act 1') {
            musicName = 'act1Music';
        } else if (levelName === 'Test Zone Act 2') {
            musicName = 'act2Music';
        } else if (levelName === 'Test Zone Act 3') {
            musicName = 'act3Music';
        } else {
            musicName = 'bgMusic'; // Fallback
        }

        console.log(`Switching music for level: ${levelName}, musicName: ${musicName}, isBossFight: ${this.isBossFight}`);
        console.log('Audio loaded for', musicName, ':', !!this.assets.getAudio(musicName));

        this.currentMusic = this.assets.getAudio(musicName);
        if (this.currentMusic) {
            try {
                this.currentMusic.currentTime = 0;
                const playPromise = this.currentMusic.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        this.musicSwitching = false;
                    }).catch(error => {
                        // Ignore abort errors (normal when switching music quickly)
                        if (error.name !== 'AbortError') {
                            console.warn('Music play error:', error);
                        }
                        this.musicSwitching = false;
                    });
                } else {
                    this.musicSwitching = false;
                }
            } catch (e) {
                this.musicSwitching = false;
            }
        } else {
            console.log('No audio object for', musicName);
            this.musicSwitching = false;
        }
    }

    // Start boss fight mode
    startBossFight() {
        this.isBossFight = true;
        this.bossCameraLocked = false; // Will lock when boss becomes visible
        // Store arena bounds for invisible walls
        this.bossArenaLeft = this.cameraX;
        this.bossArenaRight = this.cameraX + this.canvas.width;
        this.switchMusicForLevel(this.currentLevel);
    }

    // End boss fight mode
    endBossFight() {
        this.isBossFight = false;
        this.bossCameraLocked = false;
        this.switchMusicForLevel(this.currentLevel);
    }

    // Play victory music
    playVictoryMusic() {
        // Prevent concurrent music switching
        if (this.musicSwitching) return;
        this.musicSwitching = true;

        if (this.currentMusic) {
            try {
                this.currentMusic.pause();
            } catch (e) {
                // Ignore pause errors
            }
        }
        this.currentMusic = this.assets.getAudio('victoryMusic');
        if (this.currentMusic) {
            try {
                this.currentMusic.currentTime = 0;
                const playPromise = this.currentMusic.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        this.musicSwitching = false;
                    }).catch(error => {
                        if (error.name !== 'AbortError') {
                            console.warn('Victory music play error:', error);
                        }
                        this.musicSwitching = false;
                    });
                } else {
                    this.musicSwitching = false;
                }
            } catch (e) {
                this.musicSwitching = false;
            }
        } else {
            this.musicSwitching = false;
        }
    }

    // Play game complete music
    playGameCompleteMusic() {
        // Prevent concurrent music switching
        if (this.musicSwitching) return;
        this.musicSwitching = true;

        if (this.currentMusic) {
            try {
                this.currentMusic.pause();
            } catch (e) {
                // Ignore pause errors
            }
        }
        this.currentMusic = this.assets.getAudio('gameCompleteMusic');
        if (this.currentMusic) {
            try {
                this.currentMusic.currentTime = 0;
                const playPromise = this.currentMusic.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        this.musicSwitching = false;
                    }).catch(error => {
                        if (error.name !== 'AbortError') {
                            console.warn('Game complete music play error:', error);
                        }
                        this.musicSwitching = false;
                    });
                } else {
                    this.musicSwitching = false;
                }
            } catch (e) {
                this.musicSwitching = false;
            }
        } else {
            this.musicSwitching = false;
        }
    }

    nextLevel() {
        const nextLevel = CONFIG.levels[this.currentLevel]?.next;
        if (nextLevel) {
            // Save current progress
            this.saveProgress(this.currentLevel);
            
            // Stop any current music before loading new level
            if (this.currentMusic) {
                try { this.currentMusic.pause(); this.currentMusic.currentTime = 0; } catch (e) {}
                this.currentMusic = null;
            }
            this.musicSwitching = false;
            
            // Load next level
            this.currentLevel = nextLevel;
            this.loadLevelData(nextLevel);
            this.loadProgress(nextLevel);
            
            // Reset player position to start
            this.player.x = CONFIG.player.startX;
            this.player.y = CONFIG.player.startY;
            this.player.velocityX = 0;
            this.player.velocityY = 0;
            this.player.onGround = false;
            this.player.isRolling = false;
            
            // Reset level state
            this.timer = 0;
            this.scatteredRings = [];
            this.cameraX = 0;
            this.state = 'zone';
            this.hasSwitchedToGameMusic = false; // Reset music switching flag
            this.isBossFight = false; // Reset boss fight state
            setTimeout(() => this.state = 'game', CONFIG.game.zoneDisplayTimer);
        } else {
            // Game complete!
            this.state = 'gamecomplete';
        }
    }

    constructor(canvas, ctx, assetManager, currentLevel = 'Test Zone Act 1') {
        this.canvas = canvas;
        this.ctx = ctx;
        this.assets = assetManager;
        this.currentLevel = currentLevel;
        this.cameraX = 0;
        this.levelWidth = CONFIG.level.width;

        this.state = 'title';
        this.score = 0;
        this.serverAvailable = false; // Track if backend server is available
        this.hasShownInitialZone = false; // Track if initial zone screen was shown
        this.currentMusic = null; // Track current playing music
        this.isBossFight = false; // Track if in boss fight mode
        this.bossCameraLocked = false; // Track if camera is locked to boss
        this.musicSwitching = false; // Prevent concurrent music operations
        this.hasSwitchedToGameMusic = false; // Track if we've switched to game music

        // Checkpoint system
        this.checkpointX = undefined;
        this.checkpointY = undefined;

        this.player = new Player(assetManager);
        this.ground = {
            x: 0,
            y: canvas.height - CONFIG.ground.height,
            width: CONFIG.level.width,
            height: CONFIG.ground.height,
            color: CONFIG.ground.color,
        };

        this.keys = {};
        this.setupInputHandlers();
        this.deathBlackScreenTimer = 0;
        this.victoryTimer = 0;
        this.timer = 0;
        this.scatteredRings = [];

        // Add this line to initialize pits in the constructor
        this.pits = [];

        // Load level data
        this.loadLevelData(currentLevel);
        
        // Load saved progress
        this.loadProgress(currentLevel);
    }

    setupInputHandlers() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            if (this.state === 'title' && e.key === ' ') {
                this.state = 'zone';
                setTimeout(() => this.state = 'game', CONFIG.game.zoneDisplayTimer);
            }
            if (this.state === 'gameover' && (e.key === 'r' || e.key === 'R')) {
                this.restartGame(); // Full game restart
            }
            if (this.state === 'levelcomplete' && (e.key === 'r' || e.key === 'R')) {
                this.restartLevel(); // Level restart (keep progress)
            }
            if (this.state === 'gamecomplete' && (e.key === 'r' || e.key === 'R')) {
                this.restartGame(); // Full game restart
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
        // Keep current lives and score
        const currentLives = this.player.lives;
        const currentScore = this.score;
        
        // Reset player and level state
        this.player = new Player(this.assets);
        this.player.lives = currentLives;
        this.score = currentScore;
        
        // Reload level data
        this.loadLevelData(this.currentLevel);
        
        // Reset timers and state
        this.deathBlackScreenTimer = 0;
        this.timer = 0;
        this.scatteredRings = [];
        this.cameraX = 0;
        
        // Reset music switching flag and switch to level music
        this.hasSwitchedToGameMusic = false;
        
        // Stay in 'game' state
        this.state = 'game';
    }

    applyPowerUp(type) {
        if (type === 'invincibility') {
            this.player.applyInvincibilityPowerUp();
            console.log('🎯 Collected invincibility power-up!');
            // Switch to invincibility music
            this.switchToInvincibilityMusic();
        } else if (type === 'life') {
            this.player.addLife();
            console.log('❤️ Collected extra life! Lives:', this.player.lives);
            // Play extra life sound
            const extraLifeSound = this.assets.getAudio('extraLifeSound');
            if (extraLifeSound) {
                try {
                    extraLifeSound.currentTime = 0;
                    extraLifeSound.play().catch(e => {
                        if (e.name !== 'AbortError') {
                            console.warn('Extra life sound play error:', e);
                        }
                    });
                } catch (e) {
                    // Ignore play errors
                }
            }
        } else if (type === 'speed') {
            this.player.applySpeedBoost();
            console.log('⚡ Collected speed shoes! Running faster!');
            // Speed up the music
            this.speedUpMusic();
        }
        // Add more power-up types here as needed
    }

    switchToInvincibilityMusic() {
        const invincibilityMusic = this.assets.getAudio('invincibilityMusic');
        if (!invincibilityMusic) {
            console.log('Invincibility music not found, skipping music switch');
            return;
        }
        
        if (!this.musicSwitching && this.currentMusic !== invincibilityMusic) {
            if (this.currentMusic) {
                try {
                    this.currentMusic.pause();
                } catch (e) {
                    // Ignore pause errors
                }
            }
            this.currentMusic = invincibilityMusic;
            if (this.currentMusic) {
                try {
                    this.currentMusic.currentTime = 0;
                    this.currentMusic.loop = true; // Loop invincibility music
                    const playPromise = this.currentMusic.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            if (error.name !== 'AbortError') {
                                console.warn('Invincibility music play error:', error);
                            }
                        });
                    }
                } catch (e) {
                    // Ignore play errors
                }
            }
        }
    }

    switchBackToNormalMusic() {
        // Switch back to the appropriate level music
        this.switchMusicForLevel(this.currentLevel);
    }

    speedUpMusic() {
        if (this.currentMusic && this.currentMusic.playbackRate !== undefined) {
            try {
                this.currentMusic.playbackRate = 1.5; // Speed up music by 50%
            } catch (e) {
                console.warn('Failed to speed up music:', e);
            }
        }
    }

    resetMusicSpeed() {
        if (this.currentMusic && this.currentMusic.playbackRate !== undefined) {
            try {
                this.currentMusic.playbackRate = 1.0; // Reset to normal speed
            } catch (e) {
                console.warn('Failed to reset music speed:', e);
            }
        }
    }

    hideRingElements() {
        // Hide all ring img elements
        const ringElements = document.querySelectorAll('#gameContainer img[src*="ring.gif"]');
        ringElements.forEach(img => {
            img.style.display = 'none';
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
        this.ctx.fillText(this.currentLevel, this.canvas.width / 2 - 200, this.canvas.height / 2);
    }

    drawBackground() {
        // Background is an animated GIF positioned behind the canvas
        const bgImage = document.getElementById('backgroundImg');
        if (!bgImage) return;
        
        // Set background image if not set
        const img = this.assets.getImage(this.currentBackground);
        if (img) {
            bgImage.style.backgroundImage = `url(${img.src})`;
        }
        
        // Parallax scrolling - background moves slower than camera for depth
        const parallaxSpeed = 0.5;
        const offsetX = -this.cameraX * parallaxSpeed;
        
        // Move background using transform for smooth scrolling
        bgImage.style.transform = `translateX(${offsetX}px)`;
    }

    drawGround() {
        this.ctx.fillStyle = this.ground.color;
        // Only draw the visible portion of ground (canvas width, not entire level)
        this.ctx.fillRect(0, this.ground.y, this.canvas.width, this.ground.height);
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
        
        // SCORE
        this.ctx.strokeText('SCORE ' + this.score.toString().padStart(8, '0'), 20, 100);
        this.ctx.fillText('SCORE ' + this.score.toString().padStart(8, '0'), 20, 100);
        
        // LIVES (icon and count at bottom left)
        this.ctx.drawImage(this.assets.getImage('sonicIdle'), 20, this.canvas.height - 50, 30, 30);
        this.ctx.strokeText('x' + this.player.lives, 60, this.canvas.height - 30);
        this.ctx.fillText('x' + this.player.lives, 60, this.canvas.height - 30);
        
        // Draw invincibility indicator
        if (this.player.isInvincible) {
            this.ctx.fillStyle = 'yellow';
            this.ctx.fillText('INVINCIBLE', this.canvas.width / 2 - 70, 40);
        }

        // Offline indicator (only show when server is not available)
        if (!this.serverAvailable) {
            this.ctx.fillStyle = 'orange';
            this.ctx.font = '16px Arial';
            this.ctx.fillText('OFFLINE MODE', this.canvas.width - 150, 30);
            this.ctx.fillText('(Progress not saved)', this.canvas.width - 180, 50);
        }
    }

    
loop() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    if (this.state === 'title') {
        this.drawTitle();
        // Play title music only if we haven't switched to game music yet
        const titleMusic = this.assets.getAudio('titleMusic');
        if (!this.musicSwitching && this.currentMusic !== titleMusic) {
            if (this.currentMusic) {
                try {
                    this.currentMusic.pause();
                } catch (e) {
                    // Ignore pause errors
                }
            }
            this.currentMusic = titleMusic;
            if (this.currentMusic) {
                try {
                    this.currentMusic.currentTime = 0;
                    const playPromise = this.currentMusic.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            // Ignore abort errors
                            if (error.name !== 'AbortError') {
                                console.warn('Title music play error:', error);
                            }
                        });
                    }
                } catch (e) {
                    // Ignore play errors
                }
            }
        }
        document.getElementById('playerImg').style.display = 'none';
        
        // Hide all ring elements during title screen
        this.hideRingElements();
    } else if (this.state === 'zone') {
        this.drawZone();
        // Pause music during zone transition
        if (this.currentMusic) this.currentMusic.pause();
        document.getElementById('playerImg').style.display = 'none';
        
        // Hide all ring elements during zone transition
        this.hideRingElements();
    } else if (this.state === 'game') {
        // Switch to game music on first entry to game state
        if (!this.hasSwitchedToGameMusic) {
            this.hasSwitchedToGameMusic = true;
            this.switchMusicForLevel(this.currentLevel);
        }

        // If player is in death animation, update and draw only player
        if (this.player.isDeathAnimating) {
            // Draw level and dying Sonic
            this.drawBackground();
            this.drawGround();
            for (let ring of this.rings) ring.draw(this.ctx);
            for (let enemy of this.enemies) enemy.draw(this.ctx);
            this.player.update(this.keys, this.ground, this);
            this.player.draw(this.ctx, this.cameraX);
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
                    this.player.lives--; // Still lose a life
                    // Respawn at checkpoint instead of restarting level
                    this.player.respawn(this);
                    this.deathBlackScreenTimer = 0;
                    this.state = 'game';
                } else {
                    this.state = 'gameover';
                }
            }
        } else {
            this.player.update(this.keys, this.ground, this);
            // Update and check rings
            for (let ring of this.rings) {
                ring.update();
                if (!ring.collected && ring.checkCollision(this.player)) {
                    ring.collect();
                    this.player.collectRing();
                }
            }
            // Update springs
            for (let spring of this.springs) {
                spring.update();
            }
            // Update checkpoints
            for (let checkpoint of this.checkpoints) {
                checkpoint.update();
                if (checkpoint.checkCollision(this.player) && !checkpoint.activated) {
                    checkpoint.activate();
                    // Save checkpoint position for respawn
                    this.checkpointX = checkpoint.x;
                    this.checkpointY = checkpoint.y;
                    console.log('Checkpoint activated at x:', checkpoint.x);
                }
            }
            
            // Update goal (if exists)
            if (this.goal) {
                this.goal.update();
                if (this.goal.checkCollision(this.player)) {
                    // Calculate level score
                    const timeBonus = Math.max(0, 50000 - this.timer * 10);
                    const ringBonus = this.player.rings * 100;
                    this.score += timeBonus + ringBonus;
                    
                    // Save progress
                    this.saveProgress(this.currentLevel);
                    
                    // Play victory music and show victory screen
                    this.playVictoryMusic();
                    this.victoryTimer = 0;
                    this.state = 'victory';
                }
            }
            // Update and check enemies
            for (let enemy of this.enemies) {
                enemy.update();
                if (enemy.checkCollision(this.player)) {
                    const isJumpingDown = !this.player.onGround && this.player.velocityY > 0;
                    const isRolling = this.player.isRolling;
                    const hasPowerInvincibility = this.player.isPowerInvincible;
                    
                    if (isJumpingDown) {
                        enemy.destroy();
                        this.player.velocityY = CONFIG.player.jumpStrength * 0.5;
                    } else if (isRolling) {
                        enemy.destroy();
                        this.player.velocityY = CONFIG.player.jumpStrength * 0.5;
                    } else if (hasPowerInvincibility) {
                        enemy.destroy();
                        // Optional: add bounce effect when destroying enemy while invincible
                        this.player.velocityY = CONFIG.player.jumpStrength * 0.3;
                    } else {
                        this.player.takeDamage(this);
                    }
                }
            }
            // Check if player has reached boss area (Act 3)
            if (this.currentLevel === 'Test Zone Act 3' && this.boss && !this.isBossFight && this.player.x >= 2900) {
                this.startBossFight();
            }
            if (this.currentLevel === 'Hell.exe Act 3' && this.boss && !this.isBossFight && this.player.x >= 1500) {
                this.startBossFight();
            }

            // Update and check boss
            if (this.boss) {
                this.boss.update();
                // Check boss projectiles
                for (let projectile of this.boss.projectiles) {
                    if (projectile.checkCollision(this.player)) {
                        const hasPowerInvincibility = this.player.isPowerInvincible;
                        if (hasPowerInvincibility) {
                            projectile.destroy();
                        } else {
                            this.player.takeDamage(this);
                            projectile.destroy();
                        }
                    }
                }
                // Check player attack on boss
                const isJumpingDown = !this.player.onGround && this.player.velocityY > 0;
                const isRolling = this.player.isRolling;
                if (isJumpingDown || isRolling) {
                    if (this.boss.checkCollision(this.player)) {
                        this.boss.takeDamage();
                        if (isJumpingDown) {
                            this.player.velocityY = CONFIG.player.jumpStrength * 0.5; // Bounce off boss
                        } else {
                            this.player.velocityY = CONFIG.player.jumpStrength * 0.5; // Bounce off boss
                        }
                    }
                }
                // Check if boss is defeated
                if (!this.boss.isAlive) {
                    // Calculate level score
                    const timeBonus = Math.max(0, 50000 - this.timer * 10);
                    const ringBonus = this.player.rings * 100;
                    this.score += timeBonus + ringBonus;
                    
                    // Save progress
                    this.saveProgress(this.currentLevel);
                    
                    // Check if this is the final level
                    const nextLevel = CONFIG.levels[this.currentLevel]?.next;
                    if (!nextLevel) {
                        // Game complete! Play special victory music
                        this.playGameCompleteMusic();
                        this.state = 'gamecomplete';
                    } else {
                        // Play victory music and show victory screen
                        this.playVictoryMusic();
                        this.victoryTimer = 0;
                        this.state = 'victory';
                    }
                }
            }

            // Check if player reached level end (for non-boss levels without goal)
            if (!this.boss && !this.goal && this.player.x >= this.levelWidth - 100) {
                // Play victory music
                this.playVictoryMusic();
                this.victoryTimer = 0;
                this.state = 'victory';
            }
            // Update and check scattered rings
            for (let i = this.scatteredRings.length - 1; i >= 0; i--) {
                const ring = this.scatteredRings[i];
                ring.update(this.ground.y); // Pass ground position for collision
                if (ring.checkCollision(this.player)) {
                    ring.collect();
                    this.player.collectRing();
                    this.scatteredRings.splice(i, 1);  // Remove from array
                } else if (ring.lifetime <= 0) {
                    this.scatteredRings.splice(i, 1);  // Remove expired
                }
            }
            // Camera system - completely locks when boss fight is active
            let targetCameraX;
            if (this.bossCameraLocked && this.boss && this.currentLevel !== 'Hell.exe Act 3') {
                // Camera is completely frozen during boss fight
                // Don't change targetCameraX - keep it at current position
                targetCameraX = this.cameraX;
            } else {
                // Normal camera - centers on Sonic
                targetCameraX = this.player.x - this.canvas.width / 2;
            }
            this.cameraX = targetCameraX;

            // Clamp camera to level bounds to prevent showing area outside the level
            this.cameraX = Math.max(0, Math.min(this.cameraX, this.levelWidth - this.canvas.width));
            this.timer++;
            this.drawBackground();
            this.drawGround();
            for (let ring of this.rings) ring.draw(this.ctx, this.cameraX);
            for (let powerUp of this.powerUps) powerUp.draw(this.ctx, this.cameraX, this);
            for (let enemy of this.enemies) enemy.draw(this.ctx, this.cameraX);
            // Draw boss
            if (this.boss) {
                this.boss.draw(this.ctx, this.cameraX);
            }
            // Check if boss is visible to lock camera
            if (this.isBossFight && this.boss && !this.bossCameraLocked) {
                if (this.boss.x < this.cameraX + 200) {
                    this.bossCameraLocked = true;
                }
            }
            // Draw platforms
            for (let platform of this.platforms) {
                platform.draw(this.ctx, this.cameraX);
            }
            // Draw springs
            for (let spring of this.springs) {
                spring.draw(this.ctx, this.cameraX);
            }
            // Draw checkpoints
            for (let checkpoint of this.checkpoints) {
                checkpoint.draw(this.ctx, this.cameraX);
            }
            // Draw goal (if exists)
            if (this.goal) {
                this.goal.draw(this.ctx, this.cameraX);
            }
            // Draw scattered rings
            for (let ring of this.scatteredRings) {
                ring.draw(this.ctx, this.cameraX);
            }
            this.player.draw(this.ctx, this.cameraX);
            this.drawHUD();
            // Ensure current level music is playing (only if not switching music)
            if (!this.musicSwitching && this.currentMusic && this.currentMusic.paused && this.state === 'game') {
                try {
                    const playPromise = this.currentMusic.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            // Ignore abort errors
                            if (error.name !== 'AbortError') {
                                console.warn('Game music resume error:', error);
                            }
                        });
                    }
                } catch (e) {
                    // Ignore play errors
                }
            }
            document.getElementById('playerImg').style.display = 'block';
        }
    } else if (this.state === 'gameover') {
        this.drawGameOver();
        // Play game over music
        if (!this.musicSwitching && this.currentMusic !== this.assets.getAudio('gameOverMusic')) {
            if (this.currentMusic) {
                try {
                    this.currentMusic.pause();
                } catch (e) {
                    // Ignore pause errors
                }
            }
            this.currentMusic = this.assets.getAudio('gameOverMusic');
            if (this.currentMusic) {
                try {
                    this.currentMusic.currentTime = 0;
                    const playPromise = this.currentMusic.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            if (error.name !== 'AbortError') {
                                console.warn('Game over music play error:', error);
                            }
                        });
                    }
                } catch (e) {
                    // Ignore play errors
                }
            }
        }
        document.getElementById('playerImg').style.display = 'none';
    } else if (this.state === 'levelcomplete') {
        this.drawLevelComplete();
        document.getElementById('playerImg').style.display = 'none';
        if (this.currentMusic) this.currentMusic.pause();
    } else if (this.state === 'victory') {
        this.victoryTimer++;
        
        // Check if victory music has finished playing
        const victoryMusic = this.assets.getAudio('victoryMusic');
        const musicFinished = victoryMusic && (victoryMusic.ended || victoryMusic.currentTime >= victoryMusic.duration - 0.1);
        
        // Wait for music to finish OR max 20 seconds (1200 frames) as backup
        if (musicFinished || this.victoryTimer > 1200) {
            this.nextLevel();
        }
        this.drawVictory();
        document.getElementById('playerImg').style.display = 'none';
        
        // Hide all ring elements during victory screen
        this.hideRingElements();
    } else if (this.state === 'gamecomplete') {
        this.drawGameComplete();
        document.getElementById('playerImg').style.display = 'none';
        // Special victory music should already be playing from playGameCompleteMusic()
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