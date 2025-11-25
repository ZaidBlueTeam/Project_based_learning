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

    // Create a new audio instance for sound effects that can play multiple times simultaneously
    playSoundEffect(name) {
        const originalAudio = this.audio[name];
        if (!originalAudio) return null;

        // Create a new audio instance to allow overlapping plays
        const soundEffect = new Audio(originalAudio.src);
        soundEffect.volume = originalAudio.volume;
        soundEffect.playbackRate = originalAudio.playbackRate;

        // Play the sound effect
        soundEffect.play().catch(e => {
            console.warn('Failed to play sound effect:', name, e);
        });

        return soundEffect;
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
        this.ctx.fillText(this.getRestartText(), this.canvas.width / 2 - 120, this.canvas.height / 2 + 40);
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
        this.ctx.fillText(this.getPlayAgainText(), this.canvas.width / 2 - 120, this.canvas.height / 2 + 80);
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
        this.ctx.fillText(this.getRestartText(), this.canvas.width / 2 - 120, this.canvas.height / 2 + 140);
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

    // Dynamic text based on input device
    getStartText() {
        switch (this.currentInputDevice) {
            case 'controller':
                return 'Press START or A to Start';
            case 'mobile':
                return 'Tap START to Begin';
            default: // keyboard
                return 'Press SPACE to Start';
        }
    }

    getRestartText() {
        switch (this.currentInputDevice) {
            case 'controller':
                return 'Press START to Restart';
            case 'mobile':
                return 'Tap RESTART to Play Again';
            default: // keyboard
                return 'Press R to Restart';
        }
    }

    getPlayAgainText() {
        switch (this.currentInputDevice) {
            case 'controller':
                return 'Press START to Play Again';
            case 'mobile':
                return 'Tap PLAY AGAIN';
            default: // keyboard
                return 'Press R to Play Again';
        }
    }

    // Update input device based on recent input
    updateInputDevice(deviceType) {
        this.currentInputDevice = deviceType;
        this.lastInputTime = Date.now();
    }

    // Check if we should switch back to keyboard (no input for 5 seconds)
    checkInputTimeout() {
        if (this.currentInputDevice !== 'keyboard' &&
            Date.now() - this.lastInputTime > this.inputDeviceTimeout) {
            this.currentInputDevice = 'keyboard';
        }
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
        
        // Controller input state
        this.analogLeft = false;
        this.analogRight = false;
        this.analogDown = false;
        this.dpadLeft = false;
        this.dpadRight = false;
        this.dpadDown = false;
        this.dpadUp = false;
        this.buttonDown = false; // For spindash button
        this.lastHadInput = false; // For debugging controller input
        this.shownActivationMessage = false; // For activation message
        
        // Input device tracking for dynamic text
        this.currentInputDevice = 'keyboard'; // 'keyboard', 'controller', 'mobile'
        this.lastInputTime = Date.now();
        this.inputDeviceTimeout = 5000; // 5 seconds of no input switches back to keyboard
        
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
        this.hideTitleScreen(); // Ensure title screen is hidden on game initialization
    }

    setupInputHandlers() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            this.updateInputDevice('keyboard');
            if (this.state === 'title' && e.key === ' ') {
                this.hideTitleScreen();
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
            // Test controllers with 'T' key
            if (e.key === 't' || e.key === 'T') {
                this.testControllers();
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });

        // Mobile controls
        this.setupMobileControls();

        // Gamepad support
        this.setupGamepadSupport();
    }

    setupMobileControls() {
        const startBtn = document.getElementById('startBtn');
        const leftBtn = document.getElementById('leftBtn');
        const rightBtn = document.getElementById('rightBtn');
        const jumpBtn = document.getElementById('jumpBtn');
        const spindashBtn = document.getElementById('spindashBtn');

        if (!leftBtn || !rightBtn || !jumpBtn || !spindashBtn) return; // Not on mobile

        // Start button (only shown on title screen)
        if (startBtn) {
            startBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.updateInputDevice('mobile');
                if (this.state === 'title') {
                    this.hideTitleScreen();
                    this.state = 'zone';
                    setTimeout(() => this.state = 'game', CONFIG.game.zoneDisplayTimer);
                }
            });
            startBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.updateInputDevice('mobile');
                if (this.state === 'title') {
                    this.hideTitleScreen();
                    this.state = 'zone';
                    setTimeout(() => this.state = 'game', CONFIG.game.zoneDisplayTimer);
                }
            });
        }

        // Left button
        leftBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.updateInputDevice('mobile');
            this.keys['ArrowLeft'] = true;
        });
        leftBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.keys['ArrowLeft'] = false;
        });

        // Right button
        rightBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.updateInputDevice('mobile');
            this.keys['ArrowRight'] = true;
        });
        rightBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.keys['ArrowRight'] = false;
        });

        // Jump button
        jumpBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.updateInputDevice('mobile');
            this.keys[' '] = true; // Space for jump
        });
        jumpBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.keys[' '] = false;
        });

        // Spindash button
        spindashBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.updateInputDevice('mobile');
            this.keys['ArrowDown'] = true;
        });
        spindashBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.keys['ArrowDown'] = false;
        });
    }

    setupGamepadSupport() {
        this.gamepads = {};
        this.lastGamepadState = {};
        this.controllerMappings = {
            // Standard Xbox/PlayStation layout
            standard: {
                leftStick: { x: 0, y: 1 },
                rightStick: { x: 2, y: 3 },
                buttons: {
                    A: 0, // Jump (A on Xbox, X on PlayStation)
                    B: 1, // Spindash (B on Xbox, Circle on PlayStation)
                    X: 2, // Action 1
                    Y: 3, // Action 2
                    LB: 4, // Left bumper
                    RB: 5, // Right bumper
                    LT: 6, // Left trigger (analog)
                    RT: 7, // Right trigger (analog)
                    select: 8, // Back/Share
                    start: 9, // Start/Options
                    leftStickPress: 10,
                    rightStickPress: 11,
                    dpadUp: 12,
                    dpadDown: 13,
                    dpadLeft: 14,
                    dpadRight: 15
                }
            },
            // Nintendo Switch Pro Controller
            nintendo: {
                leftStick: { x: 0, y: 1 },
                rightStick: { x: 2, y: 5 },
                buttons: {
                    B: 0, // Jump
                    A: 1, // Spindash
                    Y: 2,
                    X: 3,
                    L: 4,
                    R: 5,
                    ZL: 6,
                    ZR: 7,
                    minus: 8,
                    plus: 9,
                    leftStickPress: 10,
                    rightStickPress: 11,
                    dpadUp: 12,
                    dpadDown: 13,
                    dpadLeft: 14,
                    dpadRight: 15
                }
            },
            // Generic 8BitDo controllers and other generic gamepads
            generic: {
                leftStick: { x: 0, y: 1 },
                rightStick: { x: 2, y: 3 },
                buttons: {
                    A: 0, B: 1, X: 2, Y: 3,
                    L: 4, R: 5, LT: 6, RT: 7,
                    select: 8, start: 9,
                    leftStickPress: 10, rightStickPress: 11,
                    dpadUp: 12, dpadDown: 13, dpadLeft: 14, dpadRight: 15
                }
            },
            // Retro controllers (SNES, NES style)
            retro: {
                buttons: {
                    A: 0, B: 1, X: 2, Y: 3,
                    L: 4, R: 5, select: 6, start: 7,
                    dpadUp: 8, dpadDown: 9, dpadLeft: 10, dpadRight: 11
                }
            }
        };

        window.addEventListener('gamepadconnected', (e) => {
            console.log('🎮 Gamepad connected:', e.gamepad.id);
            this.gamepads[e.gamepad.index] = e.gamepad;
            this.detectControllerType(e.gamepad);
        });

        window.addEventListener('gamepaddisconnected', (e) => {
            console.log('🎮 Gamepad disconnected:', e.gamepad.id);
            delete this.gamepads[e.gamepad.index];
            delete this.lastGamepadState[e.gamepad.index];
        });
    }

    detectControllerType(gamepad) {
        const id = gamepad.id.toLowerCase();
        const mapping = gamepad.mapping; // Standard, xr-standard, or empty string

        console.log(`🔍 Detecting controller: ${gamepad.id}`);
        console.log(`   Browser mapping: "${mapping}"`);
        console.log(`   Buttons: ${gamepad.buttons.length}, Axes: ${gamepad.axes.length}`);

        // Check for standard mapping first
        if (mapping === 'standard' || mapping === 'xr-standard') {
            this.gamepads[gamepad.index].controllerType = 'standard';
        }
        // Check by manufacturer/brand - prioritize Xbox detection
        else if (id.includes('xbox') || id.includes('microsoft') || id.includes('xinput')) {
            this.gamepads[gamepad.index].controllerType = 'standard';
            console.log('   ✅ Detected as Xbox controller');
        } 
        else if (id.includes('playstation') || id.includes('dualshock') || id.includes('sony') || id.includes('ps4') || id.includes('ps5')) {
            this.gamepads[gamepad.index].controllerType = 'standard';
        } 
        else if (id.includes('nintendo') || id.includes('switch') || id.includes('wii') || id.includes('gamecube')) {
            this.gamepads[gamepad.index].controllerType = 'nintendo';
        }
        else if (id.includes('8bitdo') || id.includes('retro') || id.includes('snes') || id.includes('nes') || id.includes('genesis')) {
            this.gamepads[gamepad.index].controllerType = 'retro';
        }
        else if (id.includes('stadia') || id.includes('stadia controller')) {
            this.gamepads[gamepad.index].controllerType = 'standard'; // Stadia uses standard mapping
        }
        else if (id.includes('steam') || id.includes('valve')) {
            this.gamepads[gamepad.index].controllerType = 'standard'; // Steam controllers
        }
        else {
            // Try to detect based on number of buttons/axes
            if (gamepad.buttons.length >= 16 && gamepad.axes.length >= 4) {
                this.gamepads[gamepad.index].controllerType = 'standard';
            } else if (gamepad.buttons.length >= 12 && gamepad.axes.length >= 2) {
                this.gamepads[gamepad.index].controllerType = 'generic';
            } else {
                this.gamepads[gamepad.index].controllerType = 'retro'; // Fallback for older controllers
            }
        }
        
        console.log(`🎯 Final controller type: ${this.gamepads[gamepad.index].controllerType}`);
    }

    // Optional: Add vibration feedback for certain actions
    vibrateController(gamepadIndex, duration = 200, weakMagnitude = 0.5, strongMagnitude = 0.5) {
        const gamepad = this.gamepads[gamepadIndex];
        if (gamepad && gamepad.vibrationActuator) {
            try {
                gamepad.vibrationActuator.playEffect('dual-rumble', {
                    startDelay: 0,
                    duration: duration,
                    weakMagnitude: weakMagnitude,
                    strongMagnitude: strongMagnitude
                });
            } catch (e) {
                // Vibration not supported or failed
                console.log('Vibration not supported on this controller');
            }
        }
    }

    // Test all connected controllers
    testControllers() {
        const gamepads = navigator.getGamepads();
        console.log('🎮 Testing all connected controllers:');
        
        for (let i = 0; i < gamepads.length; i++) {
            const gamepad = gamepads[i];
            if (!gamepad) continue;
            
            console.log(`Controller ${i}: ${gamepad.id}`);
            console.log(`  Connected: ${gamepad.connected}`);
            console.log(`  Mapping: ${gamepad.mapping || 'none'}`);
            console.log(`  Buttons: ${gamepad.buttons.length}`);
            console.log(`  Axes: ${gamepad.axes.length}`);
            
            // Test button presses
            const pressedButtons = [];
            gamepad.buttons.forEach((button, index) => {
                if (button.pressed || button.value > 0.1) {
                    pressedButtons.push(index);
                }
            });
            if (pressedButtons.length > 0) {
                console.log(`  Pressed buttons: ${pressedButtons.join(', ')}`);
            }
            
            // Test axes
            const activeAxes = [];
            gamepad.axes.forEach((axis, index) => {
                if (Math.abs(axis) > 0.1) {
                    activeAxes.push(`${index}: ${axis.toFixed(2)}`);
                }
            });
            if (activeAxes.length > 0) {
                console.log(`  Active axes: ${activeAxes.join(', ')}`);
            }
        }
        
        if (gamepads.length === 0) {
            console.log('No controllers connected. Try pressing buttons on your controller.');
        }
    }

    updateGamepadInput() {
        // Force refresh of gamepad state - try multiple times
        let gamepads = navigator.getGamepads();
        
        // If no gamepads found, try again after a short delay
        if (!gamepads || gamepads.length === 0) {
            setTimeout(() => {
                gamepads = navigator.getGamepads();
            }, 10);
        }
        
        for (let i = 0; i < gamepads.length; i++) {
            const gamepad = gamepads[i];
            if (!gamepad) continue;

            const controllerType = gamepad.controllerType || 'standard';
            const mapping = this.controllerMappings[controllerType];
            const lastState = this.lastGamepadState[i] || {};

            // Debug: Log controller state (only when input detected)
            const hasAnyInput = gamepad.axes.some(axis => Math.abs(axis) > 0.001) || 
                               gamepad.buttons.some(btn => btn.pressed || (btn.value && btn.value > 0.001));
            
            if (hasAnyInput && !this.lastHadInput) {
                console.log('🎉 CONTROLLER INPUT DETECTED!');
                this.updateInputDevice('controller');
                console.log(`🎮 Controller: ${gamepad.id}`);
                console.log(`   All Axes: [${gamepad.axes.map((v, i) => `${i}:${v?.toFixed(3)}`).join(', ')}]`);
                console.log(`   All Buttons: [${gamepad.buttons.map((b, i) => `${i}:${b?.pressed || (b?.value > 0.1)}`).join(', ')}]`);
                this.lastHadInput = true;
            } else if (!hasAnyInput) {
                this.lastHadInput = false;
            }

            // Handle analog sticks for movement
            this.handleAnalogSticks(gamepad, mapping);

            // Handle digital buttons
            this.handleDigitalButtons(gamepad, mapping, lastState, i);

            // Handle D-pad (if present)
            this.handleDpad(gamepad, mapping);

            // Save current state for next frame
            this.lastGamepadState[i] = gamepad.buttons.map(btn => btn.pressed || btn.value > 0.1);
        }
    }

    handleAnalogSticks(gamepad, mapping) {
        // Try all possible axis pairs to find the left stick
        const axes = gamepad.axes;
        
        // Test all possible X,Y axis combinations
        const possibleMappings = [
            { x: 0, y: 1 }, // Standard
            { x: 1, y: 0 }, // Swapped
            { x: 2, y: 3 }, // Right stick
            { x: 3, y: 2 }, // Right stick swapped
            { x: 0, y: 3 }, // Mixed
            { x: 1, y: 2 }, // Mixed
        ];
        
        let bestMapping = { x: 0, y: 1 }; // Default
        let bestMovement = 0;
        
        // Find which mapping has the most movement
        for (const testMapping of possibleMappings) {
            const xVal = Math.abs(axes[testMapping.x] || 0);
            const yVal = Math.abs(axes[testMapping.y] || 0);
            const totalMovement = xVal + yVal;
            
            if (totalMovement > bestMovement) {
                bestMovement = totalMovement;
                bestMapping = testMapping;
            }
        }
        
        const actualLeftX = axes[bestMapping.x] || 0;
        const actualLeftY = axes[bestMapping.y] || 0;
        
        // Only log if there's significant movement
        if (bestMovement > 0.05) {
            console.log(`🎯 Analog movement detected: X=axis${bestMapping.x}(${actualLeftX.toFixed(3)}), Y=axis${bestMapping.y}(${actualLeftY.toFixed(3)})`);
        }
        
        // Store analog stick state separately
        this.analogLeft = actualLeftX < -0.1;
        this.analogRight = actualLeftX > 0.1;
        this.analogDown = actualLeftY > 0.3;
        
        // Update movement keys based on combined input
        this.updateMovementKeys();
    }

    handleDigitalButtons(gamepad, mapping, lastState, gamepadIndex) {
        // Jump button (A button only)
        const jumpButton = mapping.buttons.A;
        this.keys[' '] = jumpButton !== undefined && gamepad.buttons[jumpButton] &&
                        (gamepad.buttons[jumpButton].pressed || gamepad.buttons[jumpButton].value > 0.1);

        // Spindash button (B button only)
        const spindashButton = mapping.buttons.B;
        this.buttonDown = spindashButton !== undefined && gamepad.buttons[spindashButton] &&
                         (gamepad.buttons[spindashButton].pressed || gamepad.buttons[spindashButton].value > 0.1);

        // Start button for restart
        if (mapping.buttons.start !== undefined && gamepad.buttons[mapping.buttons.start] && 
            gamepad.buttons[mapping.buttons.start].pressed && !lastState[mapping.buttons.start]) {
            if (this.state === 'gameover' || this.state === 'levelcomplete' || this.state === 'gamecomplete') {
                this.restartGame();
            }
        }

        // Additional actions could be mapped to other buttons
        // For example, X button could be for special moves, etc.
    }

    handleDpad(gamepad, mapping) {
        // Check all buttons to see if any are pressed (for D-pad detection)
        const buttons = gamepad.buttons;
        const pressedButtons = [];
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i] && (buttons[i].pressed || (buttons[i].value && buttons[i].value > 0.1))) {
                pressedButtons.push({ index: i, value: buttons[i].value || 1 });
            }
        }
        
        if (pressedButtons.length > 0) {
            console.log(`🎮 PRESSED BUTTONS: ${pressedButtons.map(b => `B${b.index}(${b.value.toFixed(2)})`).join(', ')}`);
        }
        
        // Try standard D-pad mapping first
        this.dpadLeft = mapping.buttons.dpadLeft !== undefined && 
                       gamepad.buttons[mapping.buttons.dpadLeft] && 
                       gamepad.buttons[mapping.buttons.dpadLeft].pressed;
        
        this.dpadRight = mapping.buttons.dpadRight !== undefined && 
                        gamepad.buttons[mapping.buttons.dpadRight] && 
                        gamepad.buttons[mapping.buttons.dpadRight].pressed;
        
        this.dpadDown = mapping.buttons.dpadDown !== undefined && 
                       gamepad.buttons[mapping.buttons.dpadDown] && 
                       gamepad.buttons[mapping.buttons.dpadDown].pressed;
        
        this.dpadUp = mapping.buttons.dpadUp !== undefined && 
                     gamepad.buttons[mapping.buttons.dpadUp] && 
                     gamepad.buttons[mapping.buttons.dpadUp].pressed;
        
        // If standard D-pad doesn't work, try common alternative button indices
        if (!this.dpadLeft && !this.dpadRight && !this.dpadDown && !this.dpadUp) {
            // Try alternative D-pad mappings
            const altMappings = [
                { left: 14, right: 15, down: 13, up: 12 }, // Standard Xbox
                { left: 6, right: 7, down: 5, up: 4 },     // Some controllers
                { left: 10, right: 11, down: 9, up: 8 },   // Other controllers
            ];
            
            for (const alt of altMappings) {
                if (buttons[alt.left] && buttons[alt.left].pressed) this.dpadLeft = true;
                if (buttons[alt.right] && buttons[alt.right].pressed) this.dpadRight = true;
                if (buttons[alt.down] && buttons[alt.down].pressed) this.dpadDown = true;
                if (buttons[alt.up] && buttons[alt.up].pressed) this.dpadUp = true;
                
                if (this.dpadLeft || this.dpadRight || this.dpadDown || this.dpadUp) {
                    console.log(`🎯 Using alternative D-pad mapping: L=${alt.left}, R=${alt.right}, D=${alt.down}, U=${alt.up}`);
                    break;
                }
            }
        }
        
        // Only log D-pad input when there's actual movement (reduce spam)
        if (this.dpadLeft || this.dpadRight || this.dpadDown || this.dpadUp) {
            console.log(`🎮 D-pad - Left: ${this.dpadLeft}, Right: ${this.dpadRight}, Down: ${this.dpadDown}, Up: ${this.dpadUp}`);
        }
        
        // Update movement keys based on combined input
        this.updateMovementKeys();
    }

    updateMovementKeys() {
        // Combine analog stick, D-pad, and button inputs
        // Movement is active if EITHER analog stick OR D-pad OR button is activating it
        this.keys['ArrowLeft'] = this.analogLeft || this.dpadLeft;
        this.keys['ArrowRight'] = this.analogRight || this.dpadRight;
        this.keys['ArrowDown'] = this.analogDown || this.dpadDown || this.buttonDown;
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
            // Play extra life sound (can play multiple times simultaneously)
            this.assets.playSoundEffect('extraLifeSound');
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
        // Use CSS background-image for animated GIF (same as background)
        const titleImg = document.getElementById('titleScreenImg');
        if (titleImg) {
            const img = this.assets.getImage('titleScreen');
            if (img) {
                titleImg.style.backgroundImage = `url(${img.src})`;
                titleImg.style.display = 'block';
            }
        }

        // Draw text overlay on canvas
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(this.canvas.width / 2 - 130, this.canvas.height - 70, 260, 30);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.getStartText(), this.canvas.width / 2, this.canvas.height - 50);
        this.ctx.textAlign = 'left';
    }

    hideTitleScreen() {
        const titleImg = document.getElementById('titleScreenImg');
        if (titleImg) {
            titleImg.style.display = 'none';
        }
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
        // Check for input device timeout (switch back to keyboard after 5 seconds of no input)
        this.checkInputTimeout();

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update gamepad input
        this.updateGamepadInput();

        if (this.state === 'title') {
            this.drawTitle();
            
            // Check for controller input to start game
            const gamepads = navigator.getGamepads();
            for (let i = 0; i < gamepads.length; i++) {
                const gamepad = gamepads[i];
                if (!gamepad) continue;
                
                const controllerType = gamepad.controllerType || 'standard';
                const mapping = this.controllerMappings[controllerType];
                
                // Check jump button (A) or start button to start game
                const jumpButton = mapping.buttons.A;
                const startButton = mapping.buttons.start;
                
                let startPressed = false;
                // Check jump button (A)
                if (jumpButton !== undefined && gamepad.buttons[jumpButton] && 
                    (gamepad.buttons[jumpButton].pressed || gamepad.buttons[jumpButton].value > 0.1)) {
                    startPressed = true;
                }
                // Check start button
                if (!startPressed && startButton !== undefined && gamepad.buttons[startButton] && 
                    gamepad.buttons[startButton].pressed) {
                    startPressed = true;
                }
                
                if (startPressed) {
                    this.state = 'zone';
                    setTimeout(() => this.state = 'game', CONFIG.game.zoneDisplayTimer);
                    break; // Only start once
                }
            }
            
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
            
            // Show start button on title screen for mobile
            const startBtn = document.getElementById('startBtn');
            if (startBtn) startBtn.style.display = 'block';
            
            // Hide movement controls on title screen
            const leftBtn = document.getElementById('leftBtn');
            const rightBtn = document.getElementById('rightBtn');
            const jumpBtn = document.getElementById('jumpBtn');
            const spindashBtn = document.getElementById('spindashBtn');
            if (leftBtn) leftBtn.style.display = 'none';
            if (rightBtn) rightBtn.style.display = 'none';
            if (jumpBtn) jumpBtn.style.display = 'none';
            if (spindashBtn) spindashBtn.style.display = 'none';
        } else if (this.state === 'zone') {
            this.drawZone();
            // Pause music during zone transition
            if (this.currentMusic) this.currentMusic.pause();
            document.getElementById('playerImg').style.display = 'none';

            // Hide all ring elements during zone transition
            this.hideRingElements();
            
            // Hide all mobile controls during zone transition
            const startBtn = document.getElementById('startBtn');
            const leftBtn = document.getElementById('leftBtn');
            const rightBtn = document.getElementById('rightBtn');
            const jumpBtn = document.getElementById('jumpBtn');
            const spindashBtn = document.getElementById('spindashBtn');
            if (startBtn) startBtn.style.display = 'none';
            if (leftBtn) leftBtn.style.display = 'none';
            if (rightBtn) rightBtn.style.display = 'none';
            if (jumpBtn) jumpBtn.style.display = 'none';
            if (spindashBtn) spindashBtn.style.display = 'none';
        } else if (this.state === 'game') {
            // Switch to game music on first entry to game state
            if (!this.hasSwitchedToGameMusic) {
                this.hasSwitchedToGameMusic = true;
                this.switchMusicForLevel(this.currentLevel);
            }

            // Show movement controls during game for mobile, hide start button
            const startBtn = document.getElementById('startBtn');
            if (startBtn) startBtn.style.display = 'none';
            
            const leftBtn = document.getElementById('leftBtn');
            const rightBtn = document.getElementById('rightBtn');
            const jumpBtn = document.getElementById('jumpBtn');
            const spindashBtn = document.getElementById('spindashBtn');
            if (leftBtn) leftBtn.style.display = 'block';
            if (rightBtn) rightBtn.style.display = 'block';
            if (jumpBtn) jumpBtn.style.display = 'block';
            if (spindashBtn) spindashBtn.style.display = 'block';

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
                        // Play ring collection sound (can play multiple times simultaneously)
                        this.assets.playSoundEffect('ringCollectSound');
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
                            // Add vibration for destroying enemy
                            this.vibrateController(0, 150, 0.3, 0.6);
                            // Play enemy hit sound (can play multiple times simultaneously)
                            this.assets.playSoundEffect('enemyHitSound');
                        } else if (isRolling) {
                            enemy.destroy();
                            this.score += 100; // Points for rolling into enemy
                            this.player.velocityY = CONFIG.player.jumpStrength * 0.5;
                            // Add vibration for destroying enemy
                            this.vibrateController(0, 150, 0.3, 0.6);
                            // Play enemy hit sound (can play multiple times simultaneously)
                            this.assets.playSoundEffect('enemyHitSound');
                        } else if (hasPowerInvincibility) {
                            enemy.destroy();
                            this.score += 100; // Points for destroying enemy while invincible
                            // Optional: add bounce effect when destroying enemy while invincible
                            this.player.velocityY = CONFIG.player.jumpStrength * 0.3;
                            // Add vibration for destroying enemy
                            this.vibrateController(0, 150, 0.3, 0.6);
                            // Play enemy hit sound (can play multiple times simultaneously)
                            this.assets.playSoundEffect('enemyHitSound');
                        } else {
                            this.player.takeDamage(this);
                        }
                    }
                }

                // Update power-ups
                for (let i = this.powerUps.length - 1; i >= 0; i--) {
                    const powerUp = this.powerUps[i];
                    powerUp.update();

                    // Remove power-ups that are broken and animation is complete
                    if (powerUp.isBroken && powerUp.brokenTimer > 30) {
                        this.powerUps.splice(i, 1);
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
                            this.boss.takeDamage(this);
                            if (isJumpingDown) {
                                this.player.velocityY = CONFIG.player.jumpStrength * 0.5; // Bounce off boss
                            } else {
                                this.player.velocityY = CONFIG.player.jumpStrength * 0.5; // Bounce off boss
                            }
                        }
                    }
                    // Check if boss is defeated (after explosion completes)
                    if (this.boss.isFullyDefeated) {
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
