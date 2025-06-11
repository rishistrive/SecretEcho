require("dotenv").config();
const PORT = process.env.PORT || 4000;
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { dbConnect } = require("./config/dbConnect");
const { Server } = require("socket.io");

const server = express();

// Middleware
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

server.use(helmet());
server.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
server.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "'unsafe-eval'"],
      "img-src": ["'self'", "https: data:"],
    },
  })
);

//  DB and Cloudinary
dbConnect();
require("./config/cloudinaryConfig");

//  Routes
server.get("/api/warmup", (req, res) => {
  console.log("Warmup request received");
  res.status(200).send("Warmed up");
});
server.use("/api/user", require("./routes/userRoutes"));
server.use("/api/chats", require("./routes/chatRoutes"));
server.use("/api/messages", require("./routes/messageRoutes"));

// Start Express Server
const appServer = server.listen(PORT,'0.0.0.0', () => {
  console.log(` Server running on http://localhost:${PORT}`);
});

// Setup Socket.IO with CORS
const io = new Server(appServer, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.IO Events
io.on("connection", (socket) => {
  console.log("⚡ Socket connected:", socket.id);

  // User setup
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
    console.log(" User setup with ID:", userData._id);
  });

  // Join specific chat room
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("🚪 Joined chat room:", room);
  });

  // Typing indicators
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  // Handle new message event
  socket.on("new message", (newMessageReceived) => {
    const chat = newMessageReceived.chat;
    if (!chat?.users) return;

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  // On disconnect
  socket.on("disconnect", () => {
    console.log(" User disconnected:", socket.id);
  });

  socket.off("setup", () => {
    console.log("User disconnected from setup event");
    socket.leave(socket.id);
  });
});
