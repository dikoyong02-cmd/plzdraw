// 본인의 Render 배포 URL로 변경하세요.
const RENDER_SERVER_URL = 'https://plzdraw-server.onrender.com';
let socket = null;

// PWA 서비스 워커 등록
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(console.error);
  });
}

// DB 초기화 및 저장된 로컬 선 복원
initDB().then(async () => {
  const savedStrokes = await getLocalStrokes();
  savedStrokes.forEach((stroke) => renderRemoteStroke(stroke));
});

// 온라인 / 오프라인 전환 제어
window.addEventListener('online', connectSocket);
window.addEventListener('offline', disconnectSocket);

function connectSocket() {
  if (typeof io === 'undefined') return;
  
  document.getElementById('status').innerText = '온라인 (Render 서버 연결 중)';
  document.getElementById('status').className = 'online';

  socket = io(RENDER_SERVER_URL, { transports: ['websocket'] });

  socket.on('draw-event', (strokeData) => {
    renderRemoteStroke(strokeData);
  });
}

function disconnectSocket() {
  document.getElementById('status').innerText = '오프라인 (로컬 저장 모드)';
  document.getElementById('status').className = 'offline';
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

// 획 이벤트 발생 시 (내 내 화면 + DB 저장 + 서버 전송)
async function onStrokeCreated(strokeData) {
  // 1. 오프라인 DB에 항상 저장
  await saveStrokeToLocal(strokeData);

  // 2. 온라인 상태면 Render 서버로 전송
  if (navigator.onLine && socket) {
    socket.emit('draw-event', strokeData);
  }
}

function renderRemoteStroke(data) {
  if (data.type === 'start') {
    drawPoint(data.pos);
  } else if (data.type === 'draw') {
    drawLineSegment(data.lastPoint, data.currentPoint, data.newPoint);
  }
}

// 초기 접속 시 소켓 연결 시도
if (navigator.onLine) connectSocket();

