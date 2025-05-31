let scoreNad = 0;
let scoreReza = 0;

const person = document.querySelector(".person-back:not(.person-reza)");
const personReza = document.querySelector(".person-reza");
const ball = document.querySelector(".basket-ball");
const app = document.querySelector(".app");
const powerBar = document.querySelector(".power-bar-vertical");
const powerFill = document.querySelector(".power-fill-vertical");
const shootInfo = document.querySelector(".shoot-info");
const net = document.querySelector(".net");
const scoreEl = document.getElementById("score");
const scoreNadEl = document.getElementById("score-nad");
const scoreRezaEl = document.getElementById("score-reza");

let isShooting = false;
let score = 0;
let turn = "nad"; // "nad" atau "reza"

// Power bar: tekan mouse untuk naik, lepas untuk shoot
let power = 0;
let charging = false;
let chargeInterval = null;
let direction = 1; // 1 = naik, -1 = turun

powerBar.addEventListener("mousedown", function () {
  if (isShooting) return;
  if (turn === "nad" && !isDragging) {
    charging = true;
    direction = 1;
    clearInterval(chargeInterval);
    chargeInterval = setInterval(() => {
      if (!charging) return;
      power += direction * 2;
      if (power >= 100) {
        power = 100;
        direction = -1;
      }
      if (power <= 0) {
        power = 0;
        direction = 1;
      }
      powerFill.style.height = power + "%";
    }, 10);
  }
  if (turn === "reza" && !isDraggingReza) {
    charging = true;
    direction = 1;
    clearInterval(chargeInterval);
    chargeInterval = setInterval(() => {
      if (!charging) return;
      power += direction * 2;
      if (power >= 100) {
        power = 100;
        direction = -1;
      }
      if (power <= 0) {
        power = 0;
        direction = 1;
      }
      powerFill.style.height = power + "%";
    }, 10);
  }
});

// Saat mouse dilepas: turun dan shoot
document.addEventListener("mouseup", function () {
  if (!charging || isShooting) return;
  charging = false;
  clearInterval(chargeInterval);
  shoot(power);
  power = 0;
  powerFill.style.height = "0%";
});

// Bola selalu ikut karakter & power bar selalu di kiri badan
function updateBallPosition() {
  let activePerson = turn === "nad" ? person : personReza;
  ball.style.left = activePerson.style.left;
  ball.style.top = parseInt(activePerson.style.top) + 140 + "px";
  powerBar.style.left = parseInt(activePerson.style.left) - 70 + "px";
  powerBar.style.top = parseInt(activePerson.style.top) + 140 + "px";
}
updateBallPosition();

// Geser karakter kiri-kanan
let isDragging = false,
  isDraggingReza = false;
let startX, startLeft, startXReza, startLeftReza;

person.addEventListener("mousedown", function (e) {
  if (isShooting || turn !== "nad") return;
  isDragging = true;
  startX = e.clientX;
  startLeft = isNaN(parseInt(person.style.left))
    ? app.offsetWidth / 2
    : parseInt(person.style.left);
  document.body.style.userSelect = "none";
});
personReza.addEventListener("mousedown", function (e) {
  if (isShooting || turn !== "reza") return;
  isDraggingReza = true;
  startXReza = e.clientX;
  startLeftReza = parseInt(personReza.style.left) || app.offsetWidth / 2 + 120;
  document.body.style.userSelect = "none";
});

document.addEventListener("mousemove", function (e) {
  if (isDragging && !isShooting) {
    let dx = e.clientX - startX;
    let newLeft = startLeft + dx;
    const minLeft = 60,
      maxLeft = app.offsetWidth - 60;
    if (newLeft < minLeft) newLeft = minLeft;
    if (newLeft > maxLeft) newLeft = maxLeft;
    person.style.left = newLeft + "px";
    updateBallPosition();
  }
  if (isDraggingReza && !isShooting) {
    let dx = e.clientX - startXReza;
    let newLeft = startLeftReza + dx;
    const minLeft = 60,
      maxLeft = app.offsetWidth - 60;
    if (newLeft < minLeft) newLeft = minLeft;
    if (newLeft > maxLeft) newLeft = maxLeft;
    personReza.style.left = newLeft + "px";
    updateBallPosition();
  }
});
document.addEventListener("mouseup", function () {
  if (isDragging) {
    isDragging = false;
    document.body.style.userSelect = "";
    updateBallPosition();
  }
  if (isDraggingReza) {
    isDraggingReza = false;
    document.body.style.userSelect = "";
    updateBallPosition();
  }
});

// Animasi bola ke ring
function shoot(power) {
  isShooting = true;
  let activePerson = turn === "nad" ? person : personReza;
  activePerson.classList.add("shoot");
  let ballTop = parseInt(ball.style.top);
  let ballLeft = parseInt(ball.style.left);

  let targetTop = 120 + 22 + 30;
  let targetLeft = 0.5 * app.offsetWidth;

  let g = 1.15;
  let duration = 60 + (100 - power) / 2;
  let dx = (targetLeft - ballLeft) / duration;
  let vy = -(power * 0.38);
  let y = ballTop;
  let x = ballLeft;
  let frame = 0;
  let groundY = app.offsetHeight - 70;

  function animate() {
    if (y < groundY && frame <= duration + 20) {
      x += dx;
      y += vy;
      vy += g;
      ball.style.left = x + "px";
      ball.style.top = y + "px";
      frame++;
      requestAnimationFrame(animate);
    } else {
      if (y >= groundY) {
        ball.style.top = groundY + "px";
      }
      checkGoal(power);
      setTimeout(() => {
        activePerson.classList.remove("shoot");
        resetBall();
      }, 400);
    }
  }
  animate();
}

// Cek apakah bola masuk ring
function checkGoal(power) {
  let ballRect = ball.getBoundingClientRect();
  let basketRect = document.querySelector(".basket").getBoundingClientRect();

  // Jika power >= 95, paksa masuk
  if (power >= 95) {
    if (turn === "nad") {
      scoreNad++;
      scoreNadEl.textContent = scoreNad;
      checkChampion();
    } else {
      scoreReza++;
      scoreRezaEl.textContent = scoreReza;
      checkChampion();
    }
    ball.style.boxShadow = "0 0 32px 8px #4caf50";
    net.classList.add("animate");
    setTimeout(() => {
      ball.style.boxShadow = "";
      net.classList.remove("animate");
    }, 500);
    return;
  }

  // Deteksi biasa
  if (
    ballRect.left + ballRect.width / 2 > basketRect.left + 30 &&
    ballRect.left + ballRect.width / 2 < basketRect.right - 30 &&
    ballRect.top + ballRect.height > basketRect.top - 20 &&
    ballRect.top < basketRect.bottom + 100
  ) {
    if (turn === "nad") {
      scoreNad++;
      scoreNadEl.textContent = scoreNad;
      checkChampion();
    } else {
      scoreReza++;
      scoreRezaEl.textContent = scoreReza;
      checkChampion();
    }
    ball.style.boxShadow = "0 0 32px 8px #4caf50";
    net.classList.add("animate");
    setTimeout(() => {
      ball.style.boxShadow = "";
      net.classList.remove("animate");
    }, 500);
  }
}

// Reset bola ke depan karakter
function resetBall() {
  turn = turn === "nad" ? "reza" : "nad";
  updateBallPosition();
  updateActivePlayer();
  isShooting = false;
}

// Set posisi awal karakter di tengah lapangan
person.style.position = "absolute";
person.style.left = app.offsetWidth / 2 + "px";
person.style.top = "250px";
updateBallPosition();

// Set posisi awal karakter reza di kanan lapangan
personReza.style.position = "absolute";
personReza.style.left = app.offsetWidth / 2 + 120 + "px";
personReza.style.top = "250px";

/* Duplicate Reza drag logic removed to prevent conflicts and errors. */

function updateActivePlayer() {
  person.classList.toggle("active", turn === "nad");
  personReza.classList.toggle("active", turn === "reza");
}

function checkChampion() {
  if (scoreNad >= 11) {
    showChampion("Nad Nad");
  } else if (scoreReza >= 11) {
    showChampion("Reza");
  }
}

function showChampion(name) {
  const banner = document.getElementById("champion-banner");
  banner.innerHTML = `🏆 <span style="color:#d32f2f">${name}</span> IS THE CHAMPION! 🏆<br><span style="font-size:0.6em;color:#333;">Refresh to play again</span>`;
  banner.style.display = "block";
  // Optional: Matikan input setelah menang
  isShooting = true;
  charging = false;
}
