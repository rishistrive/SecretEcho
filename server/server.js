require("dotenv").config();
const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const { dbConnect } = require("./config/dbConnect");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const next = require("next");
const { Server } = require("socket.io");

const app = next({ dev });
const handle = app.getRequestHandler();
const server = express();

server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(cors());
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

dbConnect();
require("./config/cloudinaryConfig");

server.get("/api/warmup", (req, res) => {
  console.log("Warmup request received");
});

server.use("/api/user", require("./routes/userRoutes"));
server.use("/api/chats", require("./routes/chatRoutes"));
server.use("/api/messages", require("./routes/messageRoutes"));

app.prepare().then(() => {
  server.all("*", (req, res) => {
    return handle(req, res);
  });
});

const appServer = server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});

const io = new Server(appServer, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  socket.on("new message", (newMesssageReceived) => {
    var chat = newMesssageReceived.chat;
    if (!chat.users) {
      console.log("Users not defined");
      return;
    }
    chat.users.forEach((user) => {
      if (user._id == newMesssageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMesssageReceived);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
