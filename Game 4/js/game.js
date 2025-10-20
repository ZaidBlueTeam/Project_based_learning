// Get the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load images
const titleImg = loadImage('images/TitleScreen.png');  // Title screen image
const backgroundImg = loadImage('images/green_hill.gif');
const sonicImg = loadImage('images/sonic.png');

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
    facing: 1  // 1 for right, -1 for left (remembers direction)
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

// Function to draw the player
function drawPlayer() {
    ctx.save();
    if (player.facing < 0) {
        // Facing left: flip
        ctx.scale(-1, 1);
        ctx.drawImage(sonicImg, -player.x - player.width, player.y, player.width, player.height);
    } else {
        // Facing right: normal
        ctx.drawImage(sonicImg, player.x, player.y, player.width, player.height);
    }
    ctx.restore();
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
    }

    // Horizontal bounds
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
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
    } else if (gameState === 'zone') {
        drawZone();
        // Pause both
        document.getElementById('titleMusic').pause();
        document.getElementById('bgMusic').pause();
    } else if (gameState === 'game') {
        updatePlayer();
        drawBackground();
        drawGround();
        drawPlayer();
        // Play level music if not already
        const bgMusic = document.getElementById('bgMusic');
        if (bgMusic.paused) bgMusic.play();
    }
    requestAnimationFrame(gameLoop);
}

// Start the game (wait for images to load)
let imagesLoaded = 0;
const totalImages = 3;  // Added titleImg

function checkImagesLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        gameLoop();
    }
}

function checkImagesLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        // Play music
        const bgMusic = document.getElementById('bgMusic');
        bgMusic.play();
        gameLoop();
    }
}

titleImg.onload = checkImagesLoaded;
backgroundImg.onload = checkImagesLoaded;
sonicImg.onload = checkImagesLoaded;