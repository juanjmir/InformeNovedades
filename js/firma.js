const canvas = document.getElementById("firma");
const ctx = canvas.getContext("2d");

let dibujando = false;
let rect = canvas.getBoundingClientRect();

/* Ajuste para pantallas retina */
const ratio = window.devicePixelRatio || 1;
canvas.width = canvas.offsetWidth * ratio;
canvas.height = canvas.offsetHeight * ratio;
ctx.scale(ratio, ratio);

ctx.lineWidth = 2;
ctx.lineCap = "round";
ctx.strokeStyle = "#000";

/* ===== FUNCIONES ===== */

function getPos(e) {
  if (e.touches) {
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top
    };
  } else {
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }
}

function startDraw(e) {
  e.preventDefault();
  dibujando = true;
  rect = canvas.getBoundingClientRect();
  const pos = getPos(e);
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
}

function draw(e) {
  if (!dibujando) return;
  e.preventDefault();
  const pos = getPos(e);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
}

function endDraw(e) {
  e.preventDefault();
  dibujando = false;
}

/* ===== EVENTOS TOUCH ===== */
canvas.addEventListener("touchstart", startDraw, { passive: false });
canvas.addEventListener("touchmove", draw, { passive: false });
canvas.addEventListener("touchend", endDraw);

/* ===== EVENTOS MOUSE ===== */
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", endDraw);
canvas.addEventListener("mouseleave", endDraw);

/* ===== LIMPIAR ===== */
function limpiarFirma() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
