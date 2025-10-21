// Get the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load images
const titleImg = loadImage('images/TitleScreen.png');  // Title screen image
const backgroundImg = loadImage('images/green_hill.gif');

// Game state ('title', 'zone', 'game')
let gameState = 'title';

// Player object (added acceleration and max speed)
let player = {
    x: 100,
    y: 500,
    width: 75,
    height: 75,
    velocityX: 0,
    velocityY: 0,
    acceleration: 0.2,  // Nerfed acceleration (slower)
    maxSpeed: 8,
    gravity: 0.4,
    jumpStrength: -15,
    onGround: true,
    facing: 1,  // 1 for right, -1 for left (remembers direction)
    // Animation properties
    animation: 'idle',  // Current animation: 'idle', 'walk', 'run', 'jump', 'crouch', 'spindash'
    spindashCharge: 0,  // Charge for spindash
    spindashSpeed: 15,  // Speed when spindashing
    spindashMode: false,  // If in spindash mode
    spindashTimer: 0  // Timer for spindash animation
};

// Ground object
let ground = {
    x: 0,
    y: canvas.height - 50,
    width: canvas.width,
    height: 50,
    color: 'green'
};

// Key states
let keys = {};

// Listen for key presses
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (gameState === 'title' && e.key === ' ') {
        gameState = 'zone';
        setTimeout(() => gameState = 'game', 2000);  // Show zone for 2 seconds
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

// Function to draw the player (now updates img element)
function drawPlayer() {
    const playerImg = document.getElementById('playerImg');
    let src;
    switch (player.animation) {
        case 'idle': src = 'images/sonic.png'; break;
        case 'walk': src = 'images/sonic_walk.gif'; break;
        case 'run': src = 'images/sonic_run.gif'; break;
        case 'jump': src = 'images/sonic_jump.gif'; break;
        case 'crouch': src = 'images/sonic_crouch.gif'; break;
        case 'spindash': src = 'images/sonic_spindash.gif'; break;
    }
    playerImg.src = src;  // Always set src
    console.log('Setting src to:', src, 'Animation:', player.animation);  // Debug
    playerImg.style.left = player.x + 'px';
    playerImg.style.top = player.y + 'px';
    if (player.facing < 0) {
        playerImg.style.transform = 'scaleX(-1)';
    } else {
        playerImg.style.transform = 'scaleX(1)';
    }
}

// Function to draw the ground
function drawGround() {
    ctx.fillStyle = ground.color;
    ctx.fillRect(ground.x, ground.y, ground.width, ground.height);
}

// Function to update player position
function updatePlayer() {
    // Horizontal movement
    if (keys['a']) {
        player.velocityX -= player.acceleration;
        if (player.velocityX < -player.maxSpeed) player.velocityX = -player.maxSpeed;
        player.facing = -1;  // Face left
    } else if (keys['d']) {
        player.velocityX += player.acceleration;
        if (player.velocityX > player.maxSpeed) player.velocityX = player.maxSpeed;
        player.facing = 1;  // Face right
    } else {
        // No key: slide with friction
        player.velocityX *= 0.95;  // Little slide, slows down gradually
    }

    // Jumping
    if (keys[' '] && player.onGround && !player.spindashMode) {
        player.velocityY = player.jumpStrength;
        player.onGround = false;
        document.getElementById('jumpSound').play();  // Play jump sound
    }

    // Spindash: Press 's' to crouch, hold to charge, release to dash
    if (keys['s'] && player.onGround) {
        if (!player.spindashMode) {
            player.spindashMode = true;
            player.animation = 'crouch';  // Start with crouch
            player.spindashTimer = 0;
            document.getElementById('spindashSound').play();  // Play charge sound
        } else {
            // Charging
            player.spindashCharge += 1;
            player.spindashTimer += 1;
            if (player.spindashTimer > 30) {  // After 0.5 seconds, show spindash animation
                player.animation = 'spindash';
            }
        }
    } else if (!keys['s'] && player.spindashMode && player.spindashCharge > 0) {
        // Release: Dash with jump animation
        player.velocityX = player.facing * player.spindashSpeed * (player.spindashCharge / 10);
        player.spindashCharge = 0;
        player.spindashTimer = 0;
        player.animation = 'jump';  // Rolling animation
        player.spindashMode = false;
    }

    // Apply horizontal velocity
    player.x += player.velocityX;

    // Jumping
    if (keys[' '] && player.onGround) {
        player.velocityY = player.jumpStrength;
        player.onGround = false;
    }

    // Apply gravity
    player.velocityY += player.gravity;
    player.y += player.velocityY;

    // Ground collision
    if (player.y + player.height >= ground.y) {
        player.y = ground.y - player.height;
        player.velocityY = 0;
        player.onGround = true;
        if (player.animation === 'spindash') {
            player.animation = 'idle';  // End spindash
            player.spindashMode = false;
            player.spindashTimer = 0;
        }
    }

    // Horizontal bounds
    if (player.x < 0) {
        player.x = 0;
        if (player.animation === 'jump') { // Stop spindash on wall
            player.animation = 'idle';
            player.velocityX = 0;
            player.spindashMode = false;
            player.spindashTimer = 0;
        }
    }
    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
        if (player.animation === 'jump') { // Stop spindash on wall
            player.animation = 'idle';
            player.velocityX = 0;
            player.spindashMode = false;
            player.spindashTimer = 0;
        }
    }

    // Stop spindash if charge runs out
    if (player.animation === 'jump' && Math.abs(player.velocityX) < 1) {
        player.animation = 'idle';
        player.spindashMode = false;
        player.spindashTimer = 0;
    }

    // Set animation based on state
    if (player.spindashMode || player.animation === 'jump') {
        // Keep spindash states
    } else if (!player.onGround) {
        player.animation = 'jump';
    } else if (Math.abs(player.velocityX) > player.maxSpeed * 0.8) {
        player.animation = 'run';
    } else if (Math.abs(player.velocityX) > 0.5) {
        player.animation = 'walk';
    } else {
        player.animation = 'idle';
    }
    console.log('Player animation set to:', player.animation, 'VelocityX:', player.velocityX);  // Debug
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
        updatePlayer();
        drawBackground();
        drawGround();
        drawPlayer();
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