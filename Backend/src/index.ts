import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { initializeSocket } from "./sockets";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

initializeSocket(io);

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
