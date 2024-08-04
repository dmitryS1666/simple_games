// Configuration
const canvasWidth = 480;
const canvasHeight = 640;
const basketWidth = 100;
const basketHeight = 20;
const basketSpeed = 10;
const eggSpeedBase = 3;
const eggSpeedVariance = 2;
const eggInterval = 1000; // milliseconds
const gameDuration = 15; // seconds

// Color configuration
const colors = ['yellow', 'blue', 'green', 'red', 'orange', 'purple', 'pink', 'brown', 'cyan', 'magenta'];
const colorProperties = {
    yellow: {score: 10},
    blue: {score: 5},
    green: {score: 2},
    red: {score: 0, gameOver: true},
    orange: {score: -5},
    purple: {score: -10},
    pink: {score: -2},
    brown: {score: 15},
    cyan: {score: 8},
    magenta: {score: 0, gameOver: true},
};

// Game state
let basketX = (canvasWidth - basketWidth) / 2;
let eggs = [];
let score = 0;
let timer;
let gameOver = false;
let highestScore = 0;

// DOM elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreElement = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');
const mainMenu = document.getElementById('mainMenu');
const startButton = document.getElementById('startButton');
const lastScoreElement = document.getElementById('lastScore');

// Initialize game
function setupGame() {
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', startGame);
    setInterval(addEgg, eggInterval);
    showMainMenu();
}

// Show main menu
function showMainMenu() {
    canvas.style.display = 'none';
    gameOverScreen.style.display = 'none';
    mainMenu.style.display = 'block';
    loadHighestScore();
}

// Start a new game
function startGame() {
    score = 0;
    basketX = (canvasWidth - basketWidth) / 2;
    eggs = [];
    updateScoreDisplay();
    startTimer();
    gameOverScreen.style.display = 'none';
    mainMenu.style.display = 'none';
    canvas.style.display = 'block';
    gameOver = false;
    gameLoop();
}

// End the game
function endGame() {
    canvas.style.display = 'none';
    finalScoreElement.textContent = `Final Score: ${score}`;
    saveHighestScore(score);
    gameOverScreen.style.display = 'block';
    gameOver = true;
    clearInterval(timer);
}

// Start the game timer
function startTimer() {
    let timeRemaining = gameDuration;
    timerElement.textContent = `Time: ${timeRemaining}`;
    timer = setInterval(() => {
        timeRemaining--;
        timerElement.textContent = `Time: ${timeRemaining}`;
        if (timeRemaining <= 0) {
            endGame();
        }
    }, 1000);
}

// Draw the basket
function drawBasket() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(basketX, canvasHeight - basketHeight, basketWidth, basketHeight);
}

// Draw all falling eggs
function drawEggs() {
    eggs.forEach(egg => {
        ctx.beginPath();
        ctx.arc(egg.x, egg.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = egg.color;
        ctx.fill();
    });
}

// Update the position of all eggs
function updateEggs() {
    eggs.forEach(egg => {
        egg.y += egg.speed;
        if (egg.y > canvasHeight) {
            eggs = eggs.filter(e => e !== egg);
        }
    });
}

// Check for collisions between eggs and the basket
function handleCollision() {
    eggs.forEach(egg => {
        if (egg.y + 10 > canvasHeight - basketHeight && egg.x > basketX && egg.x < basketX + basketWidth) {
            const properties = colorProperties[egg.color];
            score += properties.score;
            updateScoreDisplay();
            if (properties.gameOver) {
                endGame();
            }
            eggs = eggs.filter(e => e !== egg);
        }
    });
}

// Update the displayed score
function updateScoreDisplay() {
    scoreElement.textContent = `Score: ${score}`;
}

// Main game loop
function gameLoop() {
    if (gameOver) return;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawBasket();
    drawEggs();
    updateEggs();
    handleCollision();
    requestAnimationFrame(gameLoop);
}

// Add a new egg with random properties
function addEgg() {
    if (gameOver) return;
    const x = Math.random() * canvasWidth;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const speed = eggSpeedBase + Math.random() * eggSpeedVariance;
    eggs.push({x, y: 0, color, speed});
}

// Save the highest score to localStorage
function saveHighestScore(score) {
    const savedScore = localStorage.getItem('highestScore') || 0;
    highestScore = Math.max(score, savedScore);
    localStorage.setItem('highestScore', highestScore);
}

// Load the highest score from localStorage
function loadHighestScore() {
    highestScore = localStorage.getItem('highestScore') || 0;
    lastScoreElement.textContent = `Your highest score: ${highestScore}`;
}

// Handle keyboard input for basket movement
document.addEventListener('keydown', (event) => {
    if (gameOver) return;
    if (event.key === 'ArrowLeft') {
        basketX = Math.max(basketX - basketSpeed, 0);
    } else if (event.key === 'ArrowRight') {
        basketX = Math.min(basketX + basketSpeed, canvasWidth - basketWidth);
    }
});

// Setup the game on page load
setupGame();
