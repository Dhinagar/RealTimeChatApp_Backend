// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");

//const cacheMiddleware = require('express-cache-middleware');
const authRoutes = require("./src/routes/authRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
const friendsRoutes = require("./src/routes/friendsRoutes");
const chatsRoutes = require("./src/routes/chatsandmessagesRoutes");
const { VerifySocketToken } = require("./src/auth/authMiddleware");

const app = express();

// Load environment variables
require("dotenv").config();

// Enable CORS for all routes
app.use(cors());

mongoose
  .connect(
    `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.MONGODB_URI}/${process.env.DB_NAME}`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("DB connected.");
  })
  .catch((err) => {
    console.log("DB connection failed.", err);
  });

app.use(express.json());

// Express middleware for caching
// const cache = cacheMiddleware({
//   store: 'memory',
//   expire: 60,
// });

// Register routes\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/friends", friendsRoutes);
app.use("/chats", chatsRoutes);

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

io.use(VerifySocketToken);

global.onlineUsers = new Map();

const getKey = (map, val) => {
  for (let [key, value] of map.entries()) {
    if (value === val) return key;
  }
};
io.on("connection", (socket) => {
 
  global.chatSocket = socket;

  socket.on("setUserId", (userId) => {
    console.log(`User ${userId} connected with socket ${socket.id}`);
    // Store the user's socket ID in the onlineUsers map
    onlineUsers.set(userId, socket.id);
  });

  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    const sendUserSocket = onlineUsers.get(receiverId);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("getMessage", {
        from: senderId,
        to: receiverId,
        message: message,
        created_at: new Date(),
      });
    }
  });

  socket.on("disconnect", () => {
    onlineUsers.delete(getKey(onlineUsers, socket.id));
    socket.emit("getUsers", Array.from(onlineUsers));
  });
});
