const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
let lives = 3;
let level = 1;
let correctAnswer = null;
let charges = [];
let testPoint = null;

const scoreSpan = document.getElementById("score");
const livesSpan = document.getElementById("lives");
const levelSpan = document.getElementById("level");
const optionsDiv = document.getElementById("options");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");
const gameOverDiv = document.getElementById("game-over");

function updateHUD() {
  scoreSpan.textContent = `Pontos: ${score}`;
  livesSpan.textContent = `Vidas: ${"❤️".repeat(lives)}`;
  levelSpan.textContent = `Nível: ${level}`;
}

function randomPos() {
  return {
    x: Math.random() * 500 + 50,
    y: Math.random() * 500 + 50
  };
}

function createCharges(n) {
  const result = [];
  for (let i = 0; i < n; i++) {
    const isPositive = Math.random() < 0.5;
    result.push({
      x: randomPos().x,
      y: randomPos().y,
      q: isPositive ? 1 : -1
    });
  }
  return result;
}

function drawCharge(charge) {
  ctx.beginPath();
  ctx.arc(charge.x, charge.y, 20, 0, Math.PI * 2);
  ctx.fillStyle = charge.q > 0 ? "#ff6666" : "#6666ff";
  ctx.fill();
  ctx.fillStyle = "#000";
  ctx.font = "16px Arial";
  ctx.textAlign = "center";
  ctx.fillText(charge.q > 0 ? "+" : "−", charge.x, charge.y + 6);
}

function drawFieldLines() {
  charges.forEach(charge => {
    for (let angle = 0; angle < 360; angle += 45) {
      let x = charge.x;
      let y = charge.y;
      const step = 8;
      for (let i = 0; i < 20; i++) {
        const e = computeField({ x, y });
        const len = Math.sqrt(e.x ** 2 + e.y ** 2);
        x += (e.x / len) * step;
        y += (e.y / len) * step;
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, 2 * Math.PI);
        ctx.fillStyle = "#000";
        ctx.fill();
      }
    }
  });
}

function computeField(p) {
  let Ex = 0;
  let Ey = 0;
  charges.forEach(c => {
    const dx = p.x - c.x;
    const dy = p.y - c.y;
    const r2 = dx * dx + dy * dy;
    const r = Math.sqrt(r2);
    const E = c.q / r2;
    Ex += E * (dx / r);
    Ey += E * (dy / r);
  });
  return { x: Ex, y: Ey };
}

function drawArrow(from, vec) {
  const toX = from.x + vec.x * 30;
  const toY = from.y + vec.y * 30;
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(toX, toY);
  ctx.strokeStyle = "green";
  ctx.lineWidth = 2;
  ctx.stroke();

  // desenha a ponta
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(toX - 5, toY - 5);
  ctx.lineTo(toX - 5, toY + 5);
  ctx.fillStyle = "green";
  ctx.fill();
}

function nextRound() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  feedback.textContent = "";
  nextBtn.style.display = "none";
  optionsDiv.innerHTML = "";

  charges = createCharges(level === 1 ? 1 : 2);
  charges.forEach(drawCharge);
  drawFieldLines();

  testPoint = randomPos();
  ctx.beginPath();
  ctx.arc(testPoint.x, testPoint.y, 6, 0, 2 * Math.PI);
  ctx.fillStyle = "orange";
  ctx.fill();

  const e = computeField(testPoint);
  const magnitude = Math.sqrt(e.x ** 2 + e.y ** 2);
  const norm = { x: e.x / magnitude, y: e.y / magnitude };
  drawArrow(testPoint, norm);

  // Cria direções (N, S, L, O, NE...)
  const directions = [
    { name: "↑", dx: 0, dy: -1 },
    { name: "↓", dx: 0, dy: 1 },
    { name: "←", dx: -1, dy: 0 },
    { name: "→", dx: 1, dy: 0 },
    { name: "↖", dx: -1, dy: -1 },
    { name: "↗", dx: 1, dy: -1 },
    { name: "↘", dx: 1, dy: 1 },
    { name: "↙", dx: -1, dy: 1 },
  ];

  correctAnswer = directions.reduce((closest, dir) => {
    const dot = norm.x * dir.dx + norm.y * dir.dy;
    return dot > closest.dot ? { dir, dot } : closest;
  }, { dot: -Infinity }).dir.name;

  directions.forEach(dir => {
    const btn = document.createElement("div");
    btn.className = "option";
    btn.textContent = dir.name;
    btn.onclick = () => verificarResposta(dir.name);
    optionsDiv.appendChild(btn);
  });
}

function verificarResposta(escolha) {
  if (escolha === correctAnswer) {
    score += 20;
    feedback.textContent = "✅ Correto!";
    feedback.style.color = "green";
  } else {
    lives -= 1;
    feedback.textContent = `❌ Errado! Resposta correta: ${correctAnswer}`;
    feedback.style.color = "red";
  }

  updateHUD();

  if (lives === 0) {
    gameOverDiv.style.display = "block";
  } else {
    nextBtn.style.display = "inline-block";
    if (score % 100 === 0 && score > 0) level++;
  }
}

function restartGame() {
  score = 0;
  lives = 3;
  level = 1;
  gameOverDiv.style.display = "none";
  updateHUD();
  nextRound();
}

window.onload = () => {
  updateHUD();
  nextRound();
};
