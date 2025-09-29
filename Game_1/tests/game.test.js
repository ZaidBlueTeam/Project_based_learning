// Simple test for Game class
// Run with Node.js: node tests/game.test.js

import { Game } from '../src/game.js';

function testGame() {
    const game = new Game();

    // Test initial state
    console.assert(game.getBoard().every(cell => cell === null), 'Board should be empty initially');
    console.assert(game.getCurrentPlayer() === 'X', 'Current player should be X');
    console.assert(!game.isGameOver(), 'Game should not be over initially');

    // Test make move
    console.assert(game.makeMove(0, 0, 0), 'Move should succeed');
    console.assert(game.getBoard()[0] === 'X', 'Board[0] should be X');
    console.assert(game.getCurrentPlayer() === 'O', 'Current player should be O');

    // Test invalid move
    console.assert(!game.makeMove(0, 0, 0), 'Move on occupied cell should fail');

    // Test win in a row
    game.makeMove(0, 1, 0); // O at (0,1,0)
    game.makeMove(1, 0, 0); // X at (1,0,0)
    game.makeMove(0, 2, 0); // O at (0,2,0)
    game.makeMove(2, 0, 0); // X at (2,0,0), now X at (0,0,0), (1,0,0), (2,0,0)
    console.assert(game.getWinner() === 'X', 'X should win in row');
    console.assert(game.isGameOver(), 'Game should be over');

    console.log('All tests passed!');
}

// Run test
testGame();