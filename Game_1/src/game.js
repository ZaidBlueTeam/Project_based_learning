export class Game {
    constructor() {
        this.size = 3; // 3x3x3 grid
        this.board = Array(this.size ** 3).fill(null);
        this.currentPlayer = 'X';
        this.winner = null;
        this.gameOver = false;
    }

    getIndex(x, y, z) {
        return z * this.size * this.size + y * this.size + x;
    }

    makeMove(x, y, z) {
        const index = this.getIndex(x, y, z);
        if (this.board[index] || this.gameOver) {
            return false;
        }
        this.board[index] = this.currentPlayer;
        this.checkWinner();
        if (!this.winner) {
            this.switchPlayer();
        } else {
            this.gameOver = true;
        }
        return true;
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }

    checkWinner() {
        // Check all possible winning lines in 3D
        const directions = [
            // Along x-axis (rows in each layer)
            { dx: 1, dy: 0, dz: 0 },
            // Along y-axis (columns in each layer)
            { dx: 0, dy: 1, dz: 0 },
            // Along z-axis (pillars)
            { dx: 0, dy: 0, dz: 1 },
            // Diagonals in xy planes
            { dx: 1, dy: 1, dz: 0 },
            { dx: 1, dy: -1, dz: 0 },
            // Diagonals in xz planes
            { dx: 1, dy: 0, dz: 1 },
            { dx: 1, dy: 0, dz: -1 },
            // Diagonals in yz planes
            { dx: 0, dy: 1, dz: 1 },
            { dx: 0, dy: 1, dz: -1 },
            // Space diagonals
            { dx: 1, dy: 1, dz: 1 },
            { dx: 1, dy: 1, dz: -1 },
            { dx: 1, dy: -1, dz: 1 },
            { dx: -1, dy: 1, dz: 1 }
        ];

        for (let startX = 0; startX < this.size; startX++) {
            for (let startY = 0; startY < this.size; startY++) {
                for (let startZ = 0; startZ < this.size; startZ++) {
                    for (const dir of directions) {
                        let count = 0;
                        let player = null;
                        for (let i = 0; i < this.size; i++) {
                            const x = startX + dir.dx * i;
                            const y = startY + dir.dy * i;
                            const z = startZ + dir.dz * i;
                            if (x >= 0 && x < this.size && y >= 0 && y < this.size && z >= 0 && z < this.size) {
                                const index = this.getIndex(x, y, z);
                                if (this.board[index] && (player === null || this.board[index] === player)) {
                                    player = this.board[index];
                                    count++;
                                } else {
                                    break;
                                }
                            } else {
                                break;
                            }
                        }
                        if (count === this.size) {
                            this.winner = player;
                            return;
                        }
                    }
                }
            }
        }

        if (this.board.every(cell => cell !== null)) {
            this.winner = 'Draw';
            this.gameOver = true;
        }
    }

    reset() {
        this.board = Array(this.size ** 3).fill(null);
        this.currentPlayer = 'X';
        this.winner = null;
        this.gameOver = false;
    }

    getBoard() {
        return [...this.board];
    }

    getCurrentPlayer() {
        return this.currentPlayer;
    }

    getWinner() {
        return this.winner;
    }

    isGameOver() {
        return this.gameOver;
    }

    getSize() {
        return this.size;
    }
}