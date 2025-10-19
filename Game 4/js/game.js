// Get the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Player object (simple rectangle for now)
let player = {
    x: 100,
    y: 500,
    width: 50,
    height: 50,
    color: 'blue'
};

// Function to draw the player
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Function to clear and redraw the canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
}

// Call draw once to see the player
draw();

// I am gonna add here movements (Usual WASD controls)
document.addEventListener('keydown', function(event) {
    const step = 19; // Movement step size
    switch(event.key) {
        case "w": // Up
            player.y -=
            step;
            break;
            case "a": // Left
            player.x -=
            step;
            break;
            case "s": // Down
            player.y +=
            step;
            break;
            case "d": // Right
            player.x +=
            step;
            break;
    }
    draw(); // This draws the player at the new position
});