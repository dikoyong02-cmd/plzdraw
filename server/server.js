const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // GitHub Pages URL 설정 권장
    methods: ["GET", "POST"]
  }
});

app.get('/', (req, res) => {
  res.send('plzdraw Socket.io Server Running!');
});

io.on('connection', (socket) => {
  console.log('클라이언트 연결됨:', socket.id);

  // 나를 제외한 접속자들에게 그리기 이벤트 브로드캐스팅
  socket.on('draw-event', (data) => {
    socket.broadcast.emit('draw-event', data);
  });

  socket.on('disconnect', () => {
    console.log('클라이언트 연결 해제:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

