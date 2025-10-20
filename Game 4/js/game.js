// Get the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Player object (added velocityY for gravity and jumping)
let player = {
    x: 100,
    y: 500,
    width: 50,
    height: 50,
    color: 'blue',
    velocityY: 0,  // Vertical speed (for falling/jumping)
    gravity: 0.4,  // How fast player falls
    jumpStrength: -17,  // How high player jumps (negative for up)
    onGround: true  // Tracks if player is on ground
};

// Key states
let keys = {};

// Listen for key presses
document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);

// Function to draw the player
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Function to update player position
function updatePlayer() {
    const step = 5;  // Horizontal movement speed

    // Horizontal movement (left/right only)
    if (keys['a']) player.x -= step;  // Left
    if (keys['d']) player.x += step;  // Right

    // Jumping (only if on ground)
    if (keys[' '] && player.onGround) {  // Spacebar for jump
        player.velocityY = player.jumpStrength;
        player.onGround = false;
    }

    // Apply gravity (always falling)
    player.velocityY += player.gravity;
    player.y += player.velocityY;

    // Ground collision (player stops at bottom)
    const groundY = canvas.height - player.height;
    if (player.y >= groundY) {
        player.y = groundY;
        player.velocityY = 0;
        player.onGround = true;
    }

    // Keep player in horizontal bounds
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

// Game loop
function gameLoop() {
    updatePlayer();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();