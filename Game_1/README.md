# Project_based_learning
Here I play around with different programming language and make small projects to have

## 3D Tic-Tac-Toe Game

An awesome 3D Tic-Tac-Toe game built with JavaScript and Three.js, featuring a 3x3x3 grid with stunning 3D visuals and smooth animations.

### Project Structure
- `src/`: Source code
  - `game.js`: Game logic (3D board state, win checking in all directions)
  - `ui.js`: User interface handling (Three.js rendering, 3D interactions)
  - `main.js`: Entry point, ties logic and UI together
- `public/`: Static assets
  - `index.html`: Main HTML file with Three.js
  - `styles.css`: Modern gradient styling
- `tests/`: Test files
  - `game.test.js`: Basic tests for game logic

### How to Run
1. Open `public/index.html` in a modern web browser (with WebGL support).
2. Click on the glowing cubes to make your move.
3. The 3D board rotates automatically for a cool effect.
4. Click "Reset Game" to start over.

### Features
- **3D Gameplay**: 3x3x3 grid with wins in all directions (rows, columns, pillars, diagonals)
- **Stunning Visuals**: Three.js-powered 3D rendering with lighting and materials
- **Interactive 3D**: Click on cubes using raycasting
- **Smooth Animations**: Auto-rotating scene and hover effects
- **Modular Code**: ES6 modules with clear separation of concerns
- **Modern UI**: Gradient backgrounds and animated buttons
- **Comprehensive Win Detection**: Checks all possible 3D winning lines

### Running Tests
To run the tests, use Node.js:
```
node tests/game.test.js
```

### Technologies Used
- JavaScript (ES6+)
- Three.js for 3D graphics
- HTML5 Canvas
- CSS3 for styling
