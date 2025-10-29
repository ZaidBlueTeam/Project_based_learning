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

// Get the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load images
const titleImg = loadImage('images/TitleScreen.png');  // Title screen image
const backgroundImg = loadImage('images/green_hill.gif');

// Game state ('title', 'zone', 'game')
let gameState = 'title';

// Create player instance from class
let player = new Player();

// Ground object
let ground = {
    x: 0,
    y: canvas.height - CONFIG.ground.height,
    width: canvas.width,
    height: CONFIG.ground.height,
    color: CONFIG.ground.color
};

// Key states
let keys = {};

// Listen for key presses
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (gameState === 'title' && e.key === ' ') {
        gameState = 'zone';
        setTimeout(() => gameState = 'game', CONFIG.game.zoneDisplayTimer);  // Show zone for 2 seconds
    }
});
document.addEventListener('keyup', (e) => keys[e.key] = false);

// Function to draw title screen
function drawTitle() {
    ctx.drawImage(titleImg, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText('Press SPACE to Start', canvas.width / 2 - 100, canvas.height - 50);
}

// Function to draw zone screen
function drawZone() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.fillText('Test Zone', canvas.width / 2 - 150, canvas.height / 2);
}

// Function to draw the background
function drawBackground() {
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
}

// Function to draw the ground
function drawGround() {
    ctx.fillStyle = ground.color;
    ctx.fillRect(ground.x, ground.y, ground.width, ground.height);
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (gameState === 'title') {
        drawTitle();
        // Play title music if not already
        const titleMusic = document.getElementById('titleMusic');
        if (titleMusic.paused) titleMusic.play();
        // Pause level music
        document.getElementById('bgMusic').pause();
        // Hide player img
        document.getElementById('playerImg').style.display = 'none';
    } else if (gameState === 'zone') {
        drawZone();
        // Pause both
        document.getElementById('titleMusic').pause();
        document.getElementById('bgMusic').pause();
        // Hide player img
        document.getElementById('playerImg').style.display = 'none';
    } else if (gameState === 'game') {
        player.update(keys, ground);  // ✅ Use class method
        drawBackground();
        drawGround();
        player.draw();  // ✅ Use class method
        // Play level music if not already
        const bgMusic = document.getElementById('bgMusic');
        if (bgMusic.paused) bgMusic.play();
        // Show player img
        document.getElementById('playerImg').style.display = 'block';
    }
    requestAnimationFrame(gameLoop);
}

// Start the game (wait for images to load)
let imagesLoaded = 0;
const totalImages = 2;  // titleImg and backgroundImg

function checkImagesLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        // Show player img
        document.getElementById('playerImg').style.display = 'block';
        gameLoop();
    }
}

function checkImagesLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        // Play music
        const bgMusic = document.getElementById('bgMusic');
        bgMusic.play();
        // Show player img
        document.getElementById('playerImg').style.display = 'block';
        gameLoop();
    }
}

titleImg.onload = checkImagesLoaded;
backgroundImg.onload = checkImagesLoaded;