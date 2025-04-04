let score = 0;
let lives = 3;
let correctDirection = "";

const gameArea = document.getElementById("game-area");
const scoreSpan = document.getElementById("score");
const livesSpan = document.getElementById("lives");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");
const gameOverDiv = document.getElementById("game-over");

function updateHUD() {
  scoreSpan.textContent = `Pontos: ${score}`;
  livesSpan.textContent = `Vidas: ${"❤️".repeat(lives)}`;
}

function createSeta(id, symbol, left, top) {
  const seta = document.createElement("div");
  seta.className = "seta";
  seta.id = id;
  seta.innerHTML = symbol;
  seta.style.left = left;
  seta.style.top = top;
  seta.onclick = () => verificarResposta(id);
  gameArea.appendChild(seta);
}

function nextRound() {
  gameArea.innerHTML = "";
  feedback.textContent = "";
  nextBtn.style.display = "none";

  // Gera carga aleatória
  const tipo = Math.random() < 0.5 ? "+" : "−";
  const carga = document.createElement("div");
  carga.className = "carga";
  carga.textContent = tipo;
  gameArea.appendChild(carga);

  // Define direção correta do campo
  const direcoes = ["up", "down", "left", "right"];
  const direcaoAleatoria = direcoes[Math.floor(Math.random() * direcoes.length)];

  // Se for carga positiva, o campo sai (mesma direção), se for negativa, entra (oposta)
  correctDirection = tipo === "+" ? direcaoAleatoria : oposta(direcaoAleatoria);

  // Cria as setas em volta da carga
  createSeta("up", "⬆️", "130px", "40px");
  createSeta("down", "⬇️", "130px", "220px");
  createSeta("left", "⬅️", "40px", "130px");
  createSeta("right", "➡️", "220px", "130px");
}

function verificarResposta(id) {
  if (id === correctDirection) {
    score += 10;
    feedback.textContent = "✅ Correto!";
    feedback.style.color = "green";
  } else {
    lives--;
    feedback.textContent = `❌ Errado!`;
    feedback.style.color = "red";
  }

  updateHUD();

  if (lives === 0) {
    gameOver();
  } else {
    nextBtn.style.display = "inline-block";
  }
}

function oposta(dir) {
  return {
    "up": "down",
    "down": "up",
    "left": "right",
    "right": "left"
  }[dir];
}

function gameOver() {
  gameArea.innerHTML = "";
  feedback.textContent = "";
  nextBtn.style.display = "none";
  gameOverDiv.style.display = "block";
}

function restartGame() {
  score = 0;
  lives = 3;
  gameOverDiv.style.display = "none";
  updateHUD();
  nextRound();
}

window.onload = () => {
  updateHUD();
  nextRound();
};
