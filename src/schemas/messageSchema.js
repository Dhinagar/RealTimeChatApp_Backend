// schemas/userSchema.js
const mongoose = require("mongoose");

const message = new mongoose.Schema({
  messageId: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  order: { type: Number, required: true },
  message: { type: String, required: true },
  roomId: { type: String, required: true },
  created_at: { type: Date, required: true },
  updated_at: { type: Date, required: true },
});

const messages = mongoose.model("messages", message);

module.exports = messages;
