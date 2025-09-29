# Project_based_learning
Here I play around with different programming language and make small projects to have

## Tic-Tac-Toe Game

A simple Tic-Tac-Toe game built with JavaScript, following good programming practices and separation of concerns.

### Project Structure
- `src/`: Source code
  - `game.js`: Game logic (board state, win checking)
  - `ui.js`: User interface handling (rendering, events)
  - `main.js`: Entry point, ties logic and UI together
- `public/`: Static assets
  - `index.html`: Main HTML file
  - `styles.css`: Styles for the game
- `tests/`: Test files
  - `game.test.js`: Basic tests for game logic

### How to Run
1. Open `public/index.html` in a web browser.
2. Play the game by clicking on the cells.
3. Click "Reset Game" to start over.

### Features
- Modular code with ES6 modules
- Separation of concerns: logic, UI, and main
- Clean folder structure
- Basic styling
- Simple tests for game logic

### Running Tests
To run the tests, use Node.js:
```
node tests/game.test.js
```
