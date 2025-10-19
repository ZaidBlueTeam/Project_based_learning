// Get the canvas and context (same as your original)
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Player object (same as yours, but we'll add more later)
let player = {
    x: 100,
    y: 500,
    width: 50,
    height: 50,
    color: 'blue'
};

// Key states: An object to track which keys are pressed (new - allows holding keys)
let keys = {};

// Listen for key presses (new - uses arrow functions for simplicity)
document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);

// Function to draw the player (same as yours)
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Function to update player position (new - handles movement logic)
function updatePlayer() {
    const step = 5; // Slower step for smoother movement
    if (keys['w']) player.y -= step; // If 'w' is pressed, move up
    if (keys['a']) player.x -= step; // Left
    if (keys['s']) player.y += step; // Down
    if (keys['d']) player.x += step; // Right

    // Keep player in bounds (new - prevents going off-screen)
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}

// Game loop: Runs continuously for smooth updates (new - replaces your one-time draw)
function gameLoop() {
    updatePlayer(); // Update position
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    drawPlayer(); // Draw player
    requestAnimationFrame(gameLoop); // Loop again (60 times/second)
}

// Start the game (new - calls the loop)
gameLoop();