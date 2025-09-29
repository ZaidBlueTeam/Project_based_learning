export class Game {
    constructor() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.winner = null;
        this.gameOver = false;
    }

    makeMove(index) {
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
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6] // diagonals
        ];

        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                this.winner = this.board[a];
                return;
            }
        }

        if (this.board.every(cell => cell !== null)) {
            this.winner = 'Draw';
            this.gameOver = true;
        }
    }

    reset() {
        this.board = Array(9).fill(null);
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
}