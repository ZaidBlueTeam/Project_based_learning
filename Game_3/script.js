// Questions array - silly but tricky
const questions = [
    {
        question: "What happened on 5/5/2025?",
        options: ["A: The Death of Sonic.exe TD", "B: Nothing. You mother fu-", "C: Your mom", "D: Depression"],
        correct: "A",
        time: 15,
        fact: "Sonic.exe TD was a popular indie game on Roblox that sadly shut down on May 5, 2025, due to copyright issues."
    },
    {
        question: "What happened after 5/5/2025?",
        options: ["A: Nothing again", "B: People started to make TD Reborn", "C: They moved on", "D: They cried all day"],
        correct: "B",
        time: 15,
        fact: "Fans created TD Reborn as a fan-made continuation to keep the Sonic.exe TD legacy alive!"
    },
    {
        question: "What happened after the release of TD Reborn on June?",
        options: ["A: It was the perfect release", "B: It had some bugs", "C: It was a disaster", "D: No one cared"],
        correct: "C",
        time: 15,
        fact: "The initial release had major bugs, leading to frustration and a lot of questions."
    },
    {
        question: "What did the developers do after the disasterous release?",
        options: ["A: They fixed the bugs right away", "B: They closed the game", "C: They took a break", "D: They ignored the players"],
        correct: "B",
        time: 15,
        fact: "The developers decided to close the game to avoid further issues, but the game promised bug fixes in the future."
    },
    {
        question: "When did the less-buggy version of TD Reborn release?",
        options: ["A: July", "B: August", "C: Late June", "D: September"],
        correct: "A",
        time: 15,
        fact: "A more stable version was released in July, making the game enjoyable for fans again."
    }
];

// DOM elements
const titleScreen = document.getElementById('title-screen');
const gameContainer = document.getElementById('game-container');
const startBtn = document.getElementById('start-btn');
const questionEl = document.getElementById('question');
const optionA = document.getElementById('optionA');
const optionB = document.getElementById('optionB');
const optionC = document.getElementById('optionC');
const optionD = document.getElementById('optionD');
const resultEl = document.getElementById('result');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const factBox = document.getElementById('fact-box');
const factText = document.getElementById('fact-text');
const continueBtn = document.getElementById('continue-btn');
const livesEl = document.getElementById('lives');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const titleMusic = document.getElementById('title-music');
const backgroundMusic = document.getElementById('background-music');
const goodWinMusic = document.getElementById('good-win-music');
const normalWinMusic = document.getElementById('normal-win-music');
const soloWinMusic = document.getElementById('solo-win-music');
const loseMusic = document.getElementById('lose-music');
const timerOverMusic = document.getElementById('timer-over-music');

// Game variables
let currentQuestion = 0;
let lives = 3;
let score = 0;
let timer;
let timeLeft = 10;

// Start game
titleMusic.play(); // Play title music on load
startBtn.addEventListener('click', () => {
    titleScreen.style.display = 'none';
    gameContainer.style.display = 'block';
    document.body.style.backgroundImage = "url('background.jpg')"; // Switch to quiz background
    titleMusic.pause(); // Pause title music
    backgroundMusic.play(); // Play background music
    loadQuestion();
});

// Load question
function loadQuestion() {
    if (currentQuestion >= questions.length) {
        endGame("You won! All questions answered.", true, false);
        return;
    }
    // Clear previous highlights
    document.querySelectorAll('.options button').forEach(btn => btn.classList.remove('correct', 'wrong'));
    factBox.style.display = 'none'; // Hide fact box
    const q = questions[currentQuestion];
    questionEl.textContent = q.question;
    optionA.textContent = q.options[0];
    optionB.textContent = q.options[1];
    optionC.textContent = q.options[2];
    optionD.textContent = q.options[3];
    resultEl.textContent = '';
    nextBtn.style.display = 'none';
    startTimer(q.time);
}

// Start timer
function startTimer(time) {
    timeLeft = time;
    timerEl.textContent = `Time: ${timeLeft}`;
    timer = setInterval(() => {
        timeLeft--;
        timerEl.textContent = `Time: ${timeLeft}`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            wrongAnswer(true); // Timeout
        }
    }, 1000);
}

// Check answer
function checkAnswer(selected) {
    clearInterval(timer);
    const correct = questions[currentQuestion].correct;
    if (selected === correct) {
        score++;
        scoreEl.textContent = `Score: ${score}`;
        resultEl.textContent = 'Correct!';
        resultEl.style.color = 'green';
        document.getElementById(`option${selected}`).classList.add('correct');
        // Show fact
        factText.textContent = questions[currentQuestion].fact;
        factBox.style.display = 'block';
    } else {
        wrongAnswer(false); // Wrong answer
    }
}

// Wrong answer or timeout
function wrongAnswer(isTimeout) {
    lives--;
    updateLives();
    if (isTimeout) {
        resultEl.textContent = 'Too slow! Lost a life.';
        resultEl.style.color = 'orange';
        // No highlight for timeout
    } else {
        resultEl.textContent = 'Wrong! Lost a life.';
        resultEl.style.color = 'red';
        // No highlight for wrong answer
    }
    if (lives <= 0) {
        if (isTimeout) {
            endGame("You were too slow.", false, true);
        } else {
            endGame("Game Over! Out of lives.", false, false);
        }
    } else {
        if (isTimeout) {
            // Reset timer for same question
            startTimer(questions[currentQuestion].time);
        } else {
            nextBtn.style.display = 'block';
        }
    }
}

// Update lives display
function updateLives() {
    livesEl.textContent = 'Lives: ' + '❤️'.repeat(lives);
}

// End game
function endGame(message, isWin, isTimerOver = false) {
    questionEl.textContent = message;
    document.querySelector('.options').style.display = 'none';
    resultEl.textContent = `Final Score: ${score}`;
    nextBtn.style.display = 'none';
    restartBtn.style.display = 'block';
    clearInterval(timer);
    backgroundMusic.pause(); // Always pause background on end
    if (isWin) {
        if (lives === 3) {
            goodWinMusic.play(); // Perfect win
        } else if (lives === 2) {
            normalWinMusic.play(); // Normal win
        } else if (lives === 1) {
            soloWinMusic.play(); // Solo life win
        }
    } else {
        if (isTimerOver) {
            timerOverMusic.play(); // Special timer over music
        } else {
            loseMusic.play(); // Regular lose music
        }
    }
}

// Event listeners
optionA.addEventListener('click', () => checkAnswer('A'));
optionB.addEventListener('click', () => checkAnswer('B'));
optionC.addEventListener('click', () => checkAnswer('C'));
optionD.addEventListener('click', () => checkAnswer('D'));
continueBtn.addEventListener('click', () => {
    factBox.style.display = 'none';
    nextBtn.style.display = 'block';
});
restartBtn.addEventListener('click', () => {
    currentQuestion = 0;
    lives = 3;
    score = 0;
    updateLives();
    scoreEl.textContent = 'Score: 0';
    document.querySelector('.options').style.display = 'flex';
    restartBtn.style.display = 'none';
    gameContainer.style.display = 'none';
    titleScreen.style.display = 'block';
    document.body.style.backgroundImage = "url('title_bg.jpg')"; // Switch back to title background
    titleMusic.play(); // Play title music again
    goodWinMusic.pause(); // Pause all win music if playing
    goodWinMusic.currentTime = 0;
    normalWinMusic.pause();
    normalWinMusic.currentTime = 0;
    soloWinMusic.pause();
    soloWinMusic.currentTime = 0;
    loseMusic.pause(); // Pause lose music if playing
    loseMusic.currentTime = 0;
    timerOverMusic.pause(); // Pause timer over music if playing
    timerOverMusic.currentTime = 0;
    backgroundMusic.pause(); // Pause background music
    backgroundMusic.currentTime = 0;
});