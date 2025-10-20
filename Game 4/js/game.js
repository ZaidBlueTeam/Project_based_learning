// Get the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load Sonic sprite (update path if needed)
const sonicImg = loadImage('images/sonic.png');  // Assumes image is in images/ folder

// Player object (now uses image)
let player = {
    x: 100,
    y: 500,
    width: 50,
    height: 50,
    velocityY: 0,
    gravity: 0.5,
    jumpStrength: -12,
    onGround: true
};

// Ground object (simple platform)
let ground = {
    x: 0,
    y: canvas.height - 50,  // 50px high ground at bottom
    width: canvas.width,
    height: 50,
    color: 'green'
};

// Key states
let keys = {};

// Listen for key presses
document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);

// Function to draw the player (now uses image)
function drawPlayer() {
    ctx.drawImage(sonicImg, player.x, player.y, player.width, player.height);
}

// Function to draw the ground
function drawGround() {
    ctx.fillStyle = ground.color;
    ctx.fillRect(ground.x, ground.y, ground.width, ground.height);
}

// Function to update player position
function updatePlayer() {
    const step = 5;

    // Horizontal movement
    if (keys['a']) player.x -= step;
    if (keys['d']) player.x += step;

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
    updatePlayer();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGround();
    drawPlayer();
    requestAnimationFrame(gameLoop);
}

// Start the game (wait for image to load)
sonicImg.onload = () => gameLoop();