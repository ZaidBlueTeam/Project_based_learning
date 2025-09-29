export const UI = {
    boardElement: document.getElementById('board'),
    statusElement: document.getElementById('status'),
    resetButton: document.getElementById('reset-btn'),

    init(game, onCellClick, onReset) {
        this.renderBoard(game.getBoard());
        this.updateStatus(game);
        this.boardElement.addEventListener('click', (e) => {
            if (e.target.classList.contains('cell')) {
                const index = parseInt(e.target.dataset.index);
                onCellClick(index);
            }
        });
        this.resetButton.addEventListener('click', onReset);
    },

    renderBoard(board) {
        const cells = this.boardElement.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            cell.textContent = board[index] || '';
        });
    },

    updateStatus(game) {
        if (game.getWinner()) {
            if (game.getWinner() === 'Draw') {
                this.statusElement.textContent = "It's a draw!";
            } else {
                this.statusElement.textContent = `Player ${game.getWinner()} wins!`;
            }
        } else {
            this.statusElement.textContent = `Player ${game.getCurrentPlayer()}'s turn`;
        }
    },

    highlightWinner(winningCells) {
        // Optional: highlight winning cells
        winningCells.forEach(index => {
            const cell = this.boardElement.querySelector(`[data-index="${index}"]`);
            cell.style.backgroundColor = '#90EE90';
        });
    }
};