const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');

let isDrawing = false;
let lastPoint = null;
let currentPoint = null;

const BASE_THICKNESS = 16;
const MIN_THICKNESS = 2;
const BRUSH_COLOR = '#1e1e1e';

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function getPointerPos(e) {
  const rect = canvas.getBoundingClientRect();
  let pressure = e.pressure;
  if (pressure === 0 && e.buttons === 1) pressure = 0.5;

  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
    pressure: pressure
  };
}

canvas.addEventListener('pointerdown', (e) => {
  if (e.buttons !== 1) return;
  isDrawing = true;
  const pos = getPointerPos(e);
  lastPoint = pos;
  currentPoint = pos;

  drawPoint(pos);
  onStrokeCreated({ type: 'start', pos });
});

canvas.addEventListener('pointermove', (e) => {
  if (!isDrawing) return;
  const newPoint = getPointerPos(e);

  drawLineSegment(lastPoint, currentPoint, newPoint);

  onStrokeCreated({ type: 'draw', lastPoint, currentPoint, newPoint });

  lastPoint = currentPoint;
  currentPoint = {
    x: (currentPoint.x + newPoint.x) / 2,
    y: (currentPoint.y + newPoint.y) / 2
  };
});

function stopDrawing() {
  isDrawing = false;
  lastPoint = null;
  currentPoint = null;
}
canvas.addEventListener('pointerup', stopDrawing);
canvas.addEventListener('pointerleave', stopDrawing);

function drawPoint(pos) {
  ctx.beginPath();
  ctx.fillStyle = BRUSH_COLOR;
  const radius = Math.max(MIN_THICKNESS, pos.pressure * BASE_THICKNESS) / 2;
  ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawLineSegment(p1, p2, p3) {
  ctx.strokeStyle = BRUSH_COLOR;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const avgPressure = (p1.pressure + p3.pressure) / 2;
  ctx.lineWidth = Math.max(MIN_THICKNESS, avgPressure * BASE_THICKNESS);

  const midPoint = {
    x: (p2.x + p3.x) / 2,
    y: (p2.y + p3.y) / 2
  };

  ctx.beginPath();
  ctx.moveTo(p2.x, p2.y);
  ctx.quadraticCurveTo(p3.x, p3.y, midPoint.x, midPoint.y);
  ctx.stroke();
}

