// routes/profileRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../auth/authMiddleware");
const {
  createChatroomController,
  getAllChatroomController,
  getAllMessagesForChatroomController,
  sendmessageController,
} = require("../controllers/chatsandmessages.controller");

router.post("/createchatroom", verifyToken, createChatroomController);
router.get(
  "/getAllMessagesForChatroom/:chatroomId",
  verifyToken,
  getAllMessagesForChatroomController
);
router.post("/sendmessage", verifyToken, sendmessageController);
module.exports = router;
