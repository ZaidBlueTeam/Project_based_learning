import { Game } from './game.js';
import { UI } from './ui.js';

const game = new Game();

const handleCellClick = (index) => {
    if (game.makeMove(index)) {
        UI.renderBoard(game.getBoard());
        UI.updateStatus(game);
        if (game.getWinner() && game.getWinner() !== 'Draw') {
            // Optional: highlight winner, but for simplicity, skip
        }
    }
};

const handleReset = () => {
    game.reset();
    UI.renderBoard(game.getBoard());
    UI.updateStatus(game);
};

UI.init(game, handleCellClick, handleReset);