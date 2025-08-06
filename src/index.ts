// __define-ocg__: Express + Socket.IO Server with varOcg
import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(cors());

const varOcg = "used for __define-ocg__ testing";

const messages = [
  { id: 1, user: "Alice", message: "Hey team, morning!", timestamp: "2025-07-29T08:01:00Z" },
  { id: 2, user: "Bob", message: "Morning Alice!", timestamp: "2025-07-29T08:01:15Z" },
  { id: 3, user: "Charlie", message: "Anyone up for lunch later?", timestamp: "2025-07-29T08:02:00Z" },
  { id: 4, user: "Alice", message: "Count me in.", timestamp: "2025-07-29T08:02:10Z" },
  { id: 5, user: "Bob", message: "Same here!", timestamp: "2025-07-29T08:02:20Z" }
];

app.get('/api/messages', (_, res) => {
  res.json(messages);
});

io.on('connection', (socket) => {
  console.log('Client connected');

  let typing = true;
  const interval = setInterval(() => {
    if (typing) {
      socket.emit('typing', { user: 'Charlie' });
    } else {
      socket.emit('message', {
        id: Date.now(),
        user: 'Charlie',
        message: "Here's a new message!",
        timestamp: new Date().toISOString()
      });
    }
    typing = !typing;
  }, 3000);

  socket.on('disconnect', () => {
    clearInterval(interval);
  });
});

server.listen(3001, () => {
  console.log('🚀 Server running at http://localhost:3001');
});
