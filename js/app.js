// 서비스 워커 등록 (PWA 활성화)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Service Worker Registered'))
      .catch(err => console.error('SW Registration Failed:', err));
  });
}

// 온라인/오프라인 네트워크 상태 감지
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

function updateOnlineStatus() {
  if (navigator.onLine) {
    console.log('온라인 상태: Render 서버와 연결을 시도합니다.');
    // connectSocket(); // Render 서버 WebSocket 재연결 로직 실행
  } else {
    console.log('오프라인 상태: 로컬 드로잉 모드로 전환합니다.');
    // disconnectSocket(); // 소켓 연결 끊고 로컬 작업 보존
  }
}
