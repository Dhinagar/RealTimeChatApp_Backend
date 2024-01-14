// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const {
  raiseFriendRequestController,
  declineFriendRequestController,
  acceptFriendRequestController
} = require("../controllers/friendrequest.controller");
const { verifyToken } = require("../auth/authMiddleware");

router.post("/raiseFriendRequest", verifyToken, raiseFriendRequestController);
router.post("/declineFriendRequest", verifyToken, declineFriendRequestController);
router.post("/acceptFriendRequest", verifyToken, acceptFriendRequestController);

module.exports = router;
