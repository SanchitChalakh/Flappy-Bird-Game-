const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Images
const birdImg = new Image();
birdImg.src = "face.png";

// Sounds
const flapSound = new Audio("flap.wav");
const hitSound = new Audio("hit.wav");

// High Score (saved)
let highScore = localStorage.getItem("highScore") || 0;

// Bird
let bird = {
  x: 50,
  y: 200,
  w: 40,
  h: 40,
  gravity: 1.6,
  lift: -20,
  velocity: 0
};

// Game vars
let pipes = [];
let frame = 0;
let score = 0;
let gameOver = false;

// Controls
canvas.addEventListener("touchstart", tap);
document.addEventListener("keydown", tap);

function tap() {
  if (gameOver) {
    resetGame();
    return;
  }
  bird.velocity = bird.lift;
  flapSound.play();
}

function resetGame() {
  bird.y = 200;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  frame = 0;
  gameOver = false;
}

// Main loop
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Bird physics
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (bird.y + bird.h > canvas.height || bird.y < 0) endGame();

  ctx.drawImage(birdImg, bird.x, bird.y, bird.w, bird.h);

  // Pipes create
  if (frame % 90 === 0) {
    let top = Math.random() * 200 + 50;
    pipes.push({
      x: canvas.width,
      top: top,
      bottom: top + 130,
      passed: false
    });
  }

  pipes.forEach((p, i) => {
    p.x -= 2.2;

    ctx.fillStyle = "green";
    ctx.fillRect(p.x, 0, 40, p.top);
    ctx.fillRect(p.x, p.bottom, 40, canvas.height);

    // Collision
    if (
      bird.x < p.x + 40 &&
      bird.x + bird.w > p.x &&
      (bird.y < p.top || bird.y + bird.h > p.bottom)
    ) endGame();

    // Score
    if (!p.passed && p.x + 40 < bird.x) {
      score++;
      p.passed = true;
    }

    if (p.x < -40) pipes.splice(i, 1);
  });

  // Score text
  ctx.fillStyle = "white";
  ctx.font = "22px Arial";
  ctx.fillText("Score: " + score, 10, 30);
  ctx.fillText("Best: " + highScore, 10, 55);

  if (!gameOver) {
    frame++;
    requestAnimationFrame(update);
  } else {
    drawGameOver();
  }
}

function endGame() {
  hitSound.play();
  gameOver = true;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }
}

function drawGameOver() {
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "32px Arial";
  ctx.fillText("Game Over", 90, 280);

  ctx.font = "18px Arial";
  ctx.fillText("Tap to Restart", 110, 320);
}

update();
