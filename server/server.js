const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3001;

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow WebSocket connections from this origin
    methods: ["GET", "POST"], // Allow WebSocket methods
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
  });

  socket.on("send_message", (clientMsg) => {
    io.to(clientMsg.room).emit("received_message", {
      message: clientMsg.message,
    });
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
