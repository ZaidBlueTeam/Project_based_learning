// ============================
// ASSET MANAGER CLASS
// ============================
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

// ============================
// GAME CLASS
// ============================
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
            // Load from sessionStorage instead of localStorage (resets on page refresh)
            const savedProgress = sessionStorage.getItem('sonic_session_progress');
            if (savedProgress) {
                const progress = JSON.parse(savedProgress);
                this.player.lives = progress.lives;
                this.score = progress.score || 0;
                console.log(`📥 Loaded global progress: ${this.player.lives} lives, ${this.score} cumulative score`);
            } else {
                console.log(`📝 No saved progress found, using defaults`);
                this.player.lives = 3;
                this.score = 0;
            }
        } catch (error) {
            console.warn('⚠️  Could not load progress from localStorage');
            // Use defaults if loading fails
            this.player.lives = 3;
            this.score = 0;
        }
    }

    async saveProgress(levelName) {
        try {
            // Save session progress to sessionStorage (resets on page refresh)
            const progress = {
                level: levelName,
                lives: this.player.lives,
                score: this.score
            };
            sessionStorage.setItem('sonic_session_progress', JSON.stringify(progress));
            console.log(`💾 Saved session progress: ${this.player.lives} lives, ${this.score} score at ${levelName}`);
        } catch (error) {
            console.warn('⚠️ Could not save session progress');
        }
    }

    loadLevelData(levelName) {
        console.log('Loading level:', levelName);
        const levelData = CONFIG.levels[levelName];
        if (!levelData) {
            console.log('ERROR: Level data not found for', levelName);
            return;
        }
        console.log('Level data found, powerUps:', levelData.powerUps?.length || 0, 'pits:', levelData.pits?.length || 0, 'checkpoints:', levelData.checkpoints?.length || 0);

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
        console.log('Initialized powerUps:', this.powerUps.length);

        // Create platforms
        this.platforms = levelData.platforms.map(p =>
            new Platform(p.x, p.y, p.width)
        );

        // Create springs
        this.springs = levelData.springs.map(s => new Spring(s.x, s.y));

        // Add this line to initialize pits
        this.pits = levelData.pits || [];
        console.log('Initialized pits:', this.pits.length);

        // Create goal (if level has one)
        this.goal = levelData.goal ? new Goal(levelData.goal.x, this.ground.y - CONFIG.goal.height) : null;

        // Create checkpoints (if level has them)
        this.checkpoints = (levelData.checkpoints || []).map(c => new Checkpoint(c.x, this.ground.y - CONFIG.checkpoint.height));
        console.log('Initialized checkpoints:', this.checkpoints.length);

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
            // Save progress before moving to next level
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
            // Game complete - clear all saved progress for fresh restart
            try {
                sessionStorage.removeItem('sonic_session_progress');
                console.log('🎉 Game completed! Cleared all session progress for fresh restart');
            } catch (error) {
                console.warn('⚠️ Could not clear saved progress');
            }
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

        // Don't load saved progress on initial game creation - start fresh
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
        // Stop any current music
        if (this.currentMusic) {
            try {
                this.currentMusic.pause();
                this.currentMusic.currentTime = 0;
            } catch (e) {
                // Ignore music stop errors
            }
            this.currentMusic = null;
        }

        // Clear all saved progress when restarting from game over
        try {
            sessionStorage.removeItem('sonic_session_progress');
            console.log('🗑️ Cleared all session progress');
        } catch (error) {
            console.warn('⚠️ Could not clear saved progress');
        }

        // Reset to first level
        this.currentLevel = 'Test Zone Act 1';
        this.loadLevelData(this.currentLevel);

        // Reset music state variables
        this.musicSwitching = false;
        this.hasSwitchedToGameMusic = false;

        // Reset game state
        this.score = 0;
        this.checkpointX = undefined;
        this.checkpointY = undefined;
        this.deathBlackScreenTimer = 0;
        this.timer = 0;
        this.scatteredRings = [];
        this.cameraX = 0;
        this.isBossFight = false;
        this.bossCameraLocked = false;

        // Create fresh player instance
        this.player = new Player(this.assets);

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

    drawPits() {
        // Draw pits as dark rectangles to make them visible
        this.ctx.fillStyle = '#000000'; // Black pits
        for (let pit of this.pits) {
            const pitX = pit.x - this.cameraX;
            const pitY = this.ground.y;
            const pitWidth = pit.width;
            const pitHeight = this.ground.height;

            // Only draw if visible on screen
            if (pitX + pitWidth > 0 && pitX < this.canvas.width) {
                this.ctx.fillRect(pitX, pitY, pitWidth, pitHeight);

                // Add some visual detail - darker border
                this.ctx.strokeStyle = '#333333';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(pitX, pitY, pitWidth, pitHeight);
            }
        }
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
                // Draw level and dying Sonic (no rings during death)
                this.drawBackground();
                this.drawGround();
                this.drawPits();
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
                        // Save progress including current score
                        this.saveProgress(this.currentLevel);
                        console.log('Checkpoint activated at x:', checkpoint.x, '- Score saved:', this.score);
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

                        // Save progress after completing level
                        this.saveProgress(this.currentLevel);

                        // Play victory music and show victory screen
                        this.playVictoryMusic();
                        this.victoryTimer = 0;
                        this.state = 'victory';
                    }
                }
                // Update and check enemies
                for (let enemy of this.enemies) {
                    enemy.update(this);
                    if (enemy.checkCollision(this.player)) {
                        const isJumpingDown = !this.player.onGround && this.player.velocityY > 0;
                        const isRolling = this.player.isRolling;
                        const hasPowerInvincibility = this.player.isPowerInvincible;

                        if (isJumpingDown) {
                            enemy.destroy();
                            this.score += 100; // Points for jumping on enemy
                            this.player.velocityY = CONFIG.player.jumpStrength * 0.5;
                        } else if (isRolling) {
                            enemy.destroy();
                            this.score += 100; // Points for rolling into enemy
                            this.player.velocityY = CONFIG.player.jumpStrength * 0.5;
                        } else if (hasPowerInvincibility) {
                            enemy.destroy();
                            this.score += 100; // Points for destroying enemy while invincible
                            // Optional: add bounce effect when destroying enemy while invincible
                            this.player.velocityY = CONFIG.player.jumpStrength * 0.3;
                        } else {
                            this.player.takeDamage(this);
                        }
                    }
                }
                // Check if player reached boss area (Act 3)
                if (this.currentLevel === 'Test Zone Act 3' && this.boss && !this.isBossFight && this.player.x >= 2900) {
                    this.startBossFight();
                }
                if (this.currentLevel === 'Hell Zone Act 3' && this.boss && !this.isBossFight && this.player.x >= 3200) {
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
                        const bossBonus = 10000; // Bonus points for defeating boss
                        this.score += timeBonus + ringBonus + bossBonus;

                        // Save progress after defeating boss
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
                if (this.bossCameraLocked && this.boss && this.currentLevel !== 'Hell Zone Act 3' && this.currentLevel !== 'Test Zone Act 3') {
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
                this.drawPits();
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
