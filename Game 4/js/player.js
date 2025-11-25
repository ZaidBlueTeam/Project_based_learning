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
        
        // Pit falling mechanics
        this.isPitFalling = false;
        this.pitFallDistance = 0;
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
            return; // Skip normal update during death animation
        }
        
        // If pit falling, don't allow normal movement but let gravity work naturally
        if (this.isPitFalling) {
            // Only apply gravity, no horizontal movement or other controls
            this.velocityY += this.gravity;
            this.y += this.velocityY;
            
            // Track fall distance for death trigger
            this.pitFallDistance += Math.abs(this.velocityY);
            
            // Die when fallen far enough (about 2 screen heights)
            if (this.pitFallDistance > game.canvas.height * 2) {
                this.isPitFalling = false;
                this.die(game);
            }
            return; // Skip normal controls during pit fall
        }

        // Normal update logic continues...

        // Spindash: Press 's' or down arrow to crouch, hold to charge, release to dash
        // MUST be checked BEFORE horizontal movement to prevent moving while charging
        const spindashKey = keys['s'] || keys['ArrowDown'];
        if (spindashKey && this.onGround && !this.spindashMode) {
            // Can only START spindash if standing still (or moving very slowly)
            if (Math.abs(this.velocityX) < 0.5) {
                this.spindashMode = true;
                this.velocityX = 0; // Stop all movement
                this.animation = 'crouch';
                this.spindashTimer = 0;
                this.spindashCharge = 0;
                this.assets.playSoundEffect('spindashSound');
            }
        } else if (spindashKey && this.spindashMode) {
            // Charging - locked in place, can't move
            this.velocityX = 0; // Keep locked in place
            this.spindashCharge += 1;
            this.spindashTimer += 1;
            if (this.spindashTimer > CONFIG.player.spindashChargeFrames) {
                this.animation = 'spindash';
            }
        } else if (!spindashKey && this.spindashMode && this.spindashCharge > 0) {
            // Release: Dash with jump animation
            this.velocityX = this.facing * CONFIG.player.spindashSpeed * (this.spindashCharge / 10);
            this.spindashCharge = 0;
            this.spindashTimer = 0;
            this.animation = 'jump';
            this.spindashMode = false;
            this.isRolling = true; // Enter rolling mode
        } else if (!spindashKey && this.spindashMode) {
            // Cancelled spindash without charging
            this.spindashMode = false;
            this.spindashCharge = 0;
            this.spindashTimer = 0;
        }

        // Horizontal movement - BLOCKED during spindash charging
        if (!this.spindashMode) {
            if (keys['ArrowLeft'] || keys['a']) {
                this.velocityX -= this.acceleration;
                if (!this.isRolling && this.velocityX < -this.effectiveMaxSpeed) this.velocityX = -this.effectiveMaxSpeed;
                this.facing = -1;
            } else if (keys['ArrowRight'] || keys['d']) {
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
                this.assets.playSoundEffect('jumpSound');
                // Add vibration feedback for controllers
                if (game && game.vibrateController) {
                    game.vibrateController(0, 100, 0.3, 0.3); // Short vibration on first connected controller
                }
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
        
        // If not on platform, check ground (but not if over a pit)
        if (!onPlatform && this.y + this.height >= ground.y) {
            // Check if player is over a pit - if so, don't land on ground
            // Use a narrower hitbox for pit detection (player's center ± 20 pixels)
            let overPit = false;
            const playerCenterX = this.x + this.width / 2;
            for (let pit of game.pits) {
                const pitLeft = pit.x;
                const pitRight = pit.x + pit.width;
                // Only trigger if player's center is within the pit bounds
                if (playerCenterX >= pitLeft && playerCenterX <= pitRight) {
                    overPit = true;
                    break;
                }
            }
            
            if (!overPit) {
                this.y = ground.y - this.height;
                this.velocityY = 0;
                this.onGround = true;
                if (this.animation === 'spindash') {
                    this.animation = 'idle';
                    this.spindashMode = false;
                    this.spindashTimer = 0;
                }
            } else {
                this.onGround = false;
            }
        } else if (!onPlatform) {
            this.onGround = false;
        }
        
        // Check if player is falling into a pit (when they would normally land on ground but can't)
        if (!onPlatform && this.y + this.height >= ground.y && this.velocityY >= 0) {
            // Check if player is over a pit using center-based detection
            const playerCenterX = this.x + this.width / 2;
            for (let pit of game.pits) {
                const pitLeft = pit.x;
                const pitRight = pit.x + pit.width;
                // Only trigger if player's center is within the pit bounds
                if (playerCenterX >= pitLeft && playerCenterX <= pitRight) {
                    // Fell into pit - start falling animation
                    if (!this.isPitFalling) {
                        this.isPitFalling = true;
                        this.pitFallDistance = 0;
                        console.log('Fell into pit! Starting pit fall...');
                    }
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
        this.isPitFalling = false; // Reset pit falling state
        this.pitFallDistance = 0; // Reset pit fall distance
        
        // Clear power-up effects on respawn
        this.isPowerInvincible = false;
        this.powerInvincibilityTimer = 0;
        this.isSpeedBoosted = false;
        this.speedBoostTimer = 0;
        
        // Reset music speed to normal
        if (game) {
            game.resetMusicSpeed();
        }
        
        this.makeInvincible();
        
        // Reset music to beginning when respawning (like when dying without rings)
        if (game && game.currentMusic) {
            try {
                game.currentMusic.currentTime = 0;
                game.currentMusic.play();
            } catch (e) {
                // Ignore music restart errors
            }
        }
    }
    
    takeDamage(game) {
        if (this.isInvincible || this.isPowerInvincible || this.hurtTimer > 0) return;
        console.log('Player took damage! Rings before:', this.rings);
        
        // Add vibration feedback for controllers
        if (game && game.vibrateController) {
            game.vibrateController(0, 300, 0.8, 0.8); // Stronger, longer vibration for damage
        }
        
        if (this.rings > 0) {
            this.loseRings(game);
            console.log('Rings after damage:', this.rings);
            // Play ring loss sound
            if (game && game.assets) {
                const ringLossSound = game.assets.getAudio('ringLossSound');
                if (ringLossSound) ringLossSound.play().catch(e => {});
            }
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
            // Add vibration for death
            if (game && game.vibrateController) {
                game.vibrateController(0, 500, 1.0, 1.0); // Strong, long vibration for death
            }
            // Play death sound
            if (game && game.assets) {
                const deathSound = game.assets.getAudio('deathSound');
                if (deathSound) deathSound.play().catch(e => {});
            }
        }
    }
}