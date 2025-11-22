class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.enemy.width;
        this.height = CONFIG.enemy.height;
        this.speed = CONFIG.enemy.speed;
        
        // Movement
        this.startX = x;
        this.direction = 1;  // 1 = right, -1 = left
        this.patrolDistance = CONFIG.enemy.patrolDistance;
        
        // State
        this.isAlive = true;
    }
    
    update(game) {
        if (!this.isAlive) return;
        
        // Check for pits ahead and turn around if approaching one
        const checkDistance = 50; // Look ahead distance
        const pitAhead = game.pits.some(pit => {
            const pitLeft = pit.x;
            const pitRight = pit.x + pit.width;
            
            // Check if enemy is approaching a pit from either direction
            if (this.direction === 1) { // Moving right
                return this.x + this.width + checkDistance >= pitLeft && this.x + this.width <= pitLeft;
            } else { // Moving left
                return this.x - checkDistance <= pitRight && this.x >= pitRight;
            }
        });
        
        if (pitAhead) {
            this.direction *= -1; // Turn around
        }
        
        // Patrol back and forth
        this.x += this.speed * this.direction;
        
        // Turn around at patrol boundaries
        if (this.x > this.startX + this.patrolDistance) {
            this.direction = -1;
        } else if (this.x < this.startX - this.patrolDistance) {
            this.direction = 1;
        }
    }
    
    draw(ctx, cameraX) {
        if (!this.isAlive) return;
        
        // Draw enemy as red rectangle (we'll add sprites later)
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);
        
        // Draw eyes (adjusted for smaller hitbox)
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x - cameraX + 7, this.y + 7, 7, 7);
        ctx.fillRect(this.x - cameraX + 21, this.y + 7, 7, 7);
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x - cameraX + 10, this.y + 10, 4, 4);
        ctx.fillRect(this.x - cameraX + 24, this.y + 10, 4, 4);
    }
    
    checkCollision(player) {
        if (!this.isAlive) return false;
        
        // Shrink hitbox by 5 pixels on each side for more forgiving collision
        const buffer = 5;
        const enemyLeft = this.x + buffer;
        const enemyRight = this.x + this.width - buffer;
        const enemyTop = this.y + buffer;
        const enemyBottom = this.y + this.height - buffer;
        
        const playerLeft = player.x + buffer;
        const playerRight = player.x + player.width - buffer;
        const playerTop = player.y + buffer;
        const playerBottom = player.y + player.height - buffer;
        
        return playerLeft < enemyRight &&
               playerRight > enemyLeft &&
               playerTop < enemyBottom &&
               playerBottom > enemyTop;
    }
    
    destroy() {
        this.isAlive = false;
    }
}