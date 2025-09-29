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
    console.assert(game.makeMove(0), 'Move should succeed');
    console.assert(game.getBoard()[0] === 'X', 'Board[0] should be X');
    console.assert(game.getCurrentPlayer() === 'O', 'Current player should be O');

    // Test invalid move
    console.assert(!game.makeMove(0), 'Move on occupied cell should fail');

    // Test win
    game.makeMove(1); // O
    game.makeMove(3); // X
    game.makeMove(2); // O
    game.makeMove(6); // X
    console.assert(game.getWinner() === 'X', 'X should win');
    console.assert(game.isGameOver(), 'Game should be over');

    console.log('All tests passed!');
}

// Run test
testGame();