// schemas/userSchema.js
const mongoose = require("mongoose");

const chatroomSchema = new mongoose.Schema({
  chatroomId: { type: String, required: true },
  user1: { type: String, required: true },
  user2: { type: String, required: true },
  created_at: { type: Date, required: true },
  updated_at: { type: Date, required: true },
});

const chatroom = mongoose.model("Chatroom", chatroomSchema);

module.exports = chatroom;
