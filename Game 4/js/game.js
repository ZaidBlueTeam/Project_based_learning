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
    }
};

class Player {
    constructor() {
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

        // Jumping
        if (keys[' '] && this.onGround && !this.spindashMode) {
            this.velocityY = this.jumpStrength;
            this.onGround = false;
            document.getElementById('jumpSound').play();
        }

        // Spindash: Press 's' to crouch, hold to charge, release to dash
        if (keys['s'] && this.onGround) {
            if (!this.spindashMode) {
                this.spindashMode = true;
                this.animation = 'crouch';
                this.spindashTimer = 0;
                document.getElementById('spindashSound').play();
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

class Game {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;

        this.state = 'title';

        this.player = new Player();
        this.ground = {
            x: 0,
            y: canvas.height - CONFIG.ground.height,
            width: canvas.width,
            height: CONFIG.ground.height,
            color: CONFIG.ground.color,
        };

        this.keys = {};
    
        this.titleImg = this.loadImage('images/TitleScreen.png');
        this.backgroundImg = this.loadImage('images/green_hill.gif');

        this.setupInputHandlers();
    }

    loadImage(src) {
        const img = new Image();
        img.src = src;
        return img;
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
        this.ctx.drawImage(this.titleImg, 0, 0, this.canvas.width, this.canvas.height);
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
        this.ctx.drawImage(this.backgroundImg, 0, 0, this.canvas.width, this.canvas.height);
    }

    drawGround() {
        this.ctx.fillStyle = this.ground.color;
        this.ctx.fillRect(this.ground.x, this.ground.y, this.ground.width, this.ground.height);
    }

    
    loop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.state === 'title') {
            this.drawTitle();
            const titleMusic = document.getElementById('titleMusic');
            if (titleMusic.paused) titleMusic.play();
            document.getElementById('bgMusic').pause();
            document.getElementById('playerImg').style.display = 'none';
        } else if (this.state === 'zone') {
            this.drawZone();
            document.getElementById('titleMusic').pause();
            document.getElementById('bgMusic').pause();
            document.getElementById('playerImg').style.display = 'none';
        } else if (this.state === 'game') {
            this.player.update(this.keys, this.ground);
            this.drawBackground();
            this.drawGround();
            this.player.draw();
            const bgMusic = document.getElementById('bgMusic');
            if (bgMusic.paused) bgMusic.play();
            document.getElementById('playerImg').style.display = 'block';
        }
        
        requestAnimationFrame(() => this.loop());
    }

    start() {
        let imagesLoaded = 0;
        const totalImages = 2;
        
        const checkLoaded = () => {
            imagesLoaded++;
            if (imagesLoaded === totalImages) {
                document.getElementById('playerImg').style.display = 'block';
                this.loop();
            }
        };
        
        this.titleImg.onload = checkLoaded;
        this.backgroundImg.onload = checkLoaded;
    }
}

// Get the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Create and start the game
const game = new Game(canvas, ctx);
game.start();