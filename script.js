const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size
canvas.width = 600;
canvas.height = 400;

// Game variables
let basket = { x: canvas.width / 2 - 40, y: canvas.height - 30, width: 80, height: 20 };
let fallingObjects = [];
let score = 0;
let lives = 3; // Player starts with 3 lives
let highScore = localStorage.getItem("highScore") || 0; // Retrieve high score from localStorage
let isGameOver = false;

// Player controls
const keys = { left: false, right: false };

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") keys.left = true;
  if (e.key === "ArrowRight") keys.right = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") keys.left = false;
  if (e.key === "ArrowRight") keys.right = false;
});

// Function to spawn falling objects
function spawnObject() {
  const x = Math.random() * (canvas.width - 20);
  fallingObjects.push({ x, y: 0, size: 20 });
}

// Function to reset the game
function resetGame() {
  basket = { x: canvas.width / 2 - 40, y: canvas.height - 30, width: 80, height: 20 };
  fallingObjects = [];
  score = 0;
  lives = 3; // Reset lives
  isGameOver = false;
  gameLoop(); // Restart the game loop
}

// Function to update the game state
function updateGameState() {
  if (isGameOver) return;

  // Move the basket
  if (keys.left && basket.x > 0) basket.x -= 5;
  if (keys.right && basket.x + basket.width < canvas.width) basket.x += 5;

  // Update falling objects
  for (let i = 0; i < fallingObjects.length; i++) {
    fallingObjects[i].y += 2; // Falling speed

    // Check for collision with basket
    if (
      fallingObjects[i].y + fallingObjects[i].size >= basket.y &&
      fallingObjects[i].x + fallingObjects[i].size >= basket.x &&
      fallingObjects[i].x <= basket.x + basket.width
    ) {
      fallingObjects.splice(i, 1);
      score++;
    }

    // Check if the object hits the ground
    if (fallingObjects[i] && fallingObjects[i].y > canvas.height) {
      fallingObjects.splice(i, 1); // Remove the object
      lives--; // Decrease lives

      // End the game if no lives remain
      if (lives === 0) {
        isGameOver = true;

        // Update high score if current score is higher
        if (score > highScore) {
          highScore = score;
          localStorage.setItem("highScore", highScore); // Save new high score to localStorage
        }
      }
    }
  }

  // Spawn objects periodically
  if (Math.random() < 0.02) spawnObject();
}

// Function to render the game
function renderGameFrame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw basket
  ctx.fillStyle = "red";
  ctx.fillRect(basket.x, basket.y, basket.width, basket.height);

  // Draw falling objects
  ctx.fillStyle = "yellow";
  for (const obj of fallingObjects) {
    ctx.fillRect(obj.x, obj.y, obj.size, obj.size);
  }

  // Draw scores and lives
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);
  ctx.fillText(`Lives: ${lives}`, 10, 60);
  ctx.fillText(`High Score: ${highScore}`, 10, 90);

  // Game over message
  if (isGameOver) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, canvas.height / 2 - 40, canvas.width, 120);
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2);
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 40);

    // Restart prompt
    ctx.font = "20px Arial";
    ctx.fillText("Press R to Restart", canvas.width / 2, canvas.height / 2 + 80);
  }
}

// Listen for restart key ('R')
document.addEventListener("keydown", (e) => {
  if (e.key === "r" && isGameOver) {
    resetGame();
  }
});

// Main game loop
function gameLoop() {
  updateGameState();
  renderGameFrame();
  if (!isGameOver) requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
