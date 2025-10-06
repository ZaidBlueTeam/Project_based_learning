// Get the message element to show feedback
const message = document.getElementById('message');
const newGameBtn = document.getElementById('new-game');
const buttons = document.querySelectorAll('.buttons button');

// Generate a random number between 1 and 10 at start
let secretNumber = Math.floor(Math.random() * 10) + 1;

// Function to check the guess
function checkGuess(guess) {
    if (guess == secretNumber) {
        message.textContent = 'Correct! You win!';
        disableButtons();
    } else if (guess < secretNumber) {
        message.textContent = 'Too low! Try again.';
    } else {
        message.textContent = 'Too high! Try again.';
    }
}

// Add click event to each number button
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const guess = parseInt(button.textContent);
        checkGuess(guess);
    });
});

// New game button resets everything
newGameBtn.addEventListener('click', () => {
    secretNumber = Math.floor(Math.random() * 10) + 1;
    message.textContent = 'Good luck!';
    enableButtons();
});

// Helper functions to disable/enable buttons
function disableButtons() {
    buttons.forEach(btn => btn.disabled = true);
}
function enableButtons() {
    buttons.forEach(btn => btn.disabled = false);
}