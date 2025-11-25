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
        this.isExploding = false; // New: explosion state
        this.explosionTimer = 0; // New: timer for explosion effect
        this.fadeAlpha = 1.0; // New: for smooth fade out
        this.isFullyDefeated = false; // New: true only after explosion completes

        // Attack
        this.shootTimer = 0;
        this.shootCooldown = 120; // Shoot every 2 seconds (60fps)
        this.projectiles = [];

        // Animation
        this.animationFrame = 0;
    }

    update() {
        if (!this.isAlive) return;

        // Handle explosion animation
        if (this.isExploding) {
            this.explosionTimer++;
            
            // Explosion effect: shake and fade
            if (this.explosionTimer < 30) { // 0.5 seconds of explosion
                // Shake effect
                const shakeAmount = 5;
                const shakeX = (Math.random() - 0.5) * shakeAmount;
                const shakeY = (Math.random() - 0.5) * shakeAmount;
                this.img.style.transform = `translate(${shakeX}px, ${shakeY}px)`;
                
                // Fade out gradually
                this.fadeAlpha = Math.max(0.3, 1.0 - (this.explosionTimer / 30));
                this.img.style.opacity = this.fadeAlpha;
                
            } else if (this.explosionTimer < 60) { // 1 second total
                // Stop shaking, continue fading
                this.img.style.transform = 'translate(0px, 0px)';
                this.fadeAlpha = Math.max(0, 0.3 - ((this.explosionTimer - 30) / 30));
                this.img.style.opacity = this.fadeAlpha;
                
            } else {
                // Explosion complete, destroy boss
                this.isFullyDefeated = true;
                this.destroy();
                return;
            }
            
            // Don't do normal movement during explosion
            return;
        }

        // Normal boss behavior continues...
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
        if (!this.isAlive || this.isExploding) return false;

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

    takeDamage(game) {
        this.health--;
        // Play hit sound when boss takes damage (can play multiple times simultaneously)
        if (game && game.assets) {
            game.assets.playSoundEffect('bossHitSound');
        }
        if (this.health <= 0) {
            this.startExplosion(game);
        }
    }

    startExplosion(game) {
        this.isExploding = true;
        this.explosionTimer = 0;
        // Add vibration for boss defeat
        if (game && game.vibrateController) {
            game.vibrateController(0, 800, 1.0, 1.0); // Strong, long vibration for boss defeat
        }
        // Play explosion sound (can play multiple times simultaneously)
        if (game && game.assets) {
            game.assets.playSoundEffect('explosionSound');
        }
        // Stop boss music and resume level music
        if (game) {
            game.endBossFight();
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
        this.isBroken = false;
        this.brokenTimer = 0;
    }

    update() {
        if (this.isBroken) {
            this.brokenTimer++;
            // Remove after animation (30 frames = 0.5 seconds)
            if (this.brokenTimer > 30) {
                // Power-up is completely removed
            }
        }
    }

    checkCollision(player) {
        if (this.isBroken) return false;

        return player.x < this.x + this.width &&
               player.x + player.width > this.x &&
               player.y < this.y + this.height &&
               player.y + player.height > this.y;
    }

    // Check if player is jumping up into the power-up box from below
    checkBreakFromBottom(player) {
        if (this.isBroken || this.collected) return false;

        // Player must be moving upward (jumping)
        if (player.velocityY >= 0) return false;

        // Player's head must be below the box bottom but above the box top
        const playerHeadY = player.y;
        const boxBottom = this.y + this.height;
        const boxTop = this.y;

        // Player head should be close to box bottom (within a few pixels)
        const tolerance = 10;
        if (playerHeadY > boxBottom - tolerance && playerHeadY < boxBottom + tolerance) {
            // Check horizontal overlap
            const playerLeft = player.x;
            const playerRight = player.x + player.width;
            const boxLeft = this.x;
            const boxRight = this.x + this.width;

            return playerLeft < boxRight && playerRight > boxLeft;
        }

        return false;
    }

    break(game) {
        if (this.isBroken || this.collected) return;

        this.isBroken = true;
        this.brokenTimer = 0;

        // Play break sound (same as enemy hit) - can play multiple times simultaneously
        if (game && game.assets) {
            game.assets.playSoundEffect('enemyHitSound');
        }

        // Add vibration
        if (game && game.vibrateController) {
            game.vibrateController(0, 100, 0.2, 0.4);
        }

        // Award points for breaking the box
        if (game) {
            game.score += 50;
        }

        // Apply the power-up effect when broken from below
        if (game) {
            game.applyPowerUp(this.type);
        }
    }

    checkCollision(player) {
        return player.x < this.x + this.width &&
               player.x + player.width > this.x &&
               player.y < this.y + this.height &&
               player.y + player.height > this.y;
    }

    draw(ctx, cameraX, game) {
        if (this.collected || this.isBroken) {
            if (this.isBroken) {
                // Draw breaking animation (simple fade out)
                const alpha = Math.max(0, 1.0 - (this.brokenTimer / 30));
                ctx.globalAlpha = alpha;
            } else {
                return; // Don't draw collected power-ups
            }
        }

        // Draw power-up sprite or fallback box
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

        if (this.isBroken) {
            ctx.globalAlpha = 1.0; // Reset alpha
        }

        // Check for collection (only if jumping or spindashing) - but not if broken
        if (!this.isBroken && this.checkCollision(game.player)) {
            const isJumpingDown = !game.player.onGround && game.player.velocityY > 0;
            const isRolling = game.player.isRolling;
            if (isJumpingDown || isRolling) {
                this.collected = true;
                game.applyPowerUp(this.type);
            }
        }

        // Check for breaking from below
        if (!this.collected && this.checkBreakFromBottom(game.player)) {
            this.break(game);
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

        // Play spring sound (can play multiple times simultaneously)
        player.assets.playSoundEffect('springSound');
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