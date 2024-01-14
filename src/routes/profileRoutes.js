// routes/profileRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../auth/authMiddleware");
const {
  getprofileController,
  updateProfileController,
  deactivateProfileController,
} = require("../controllers/profile.controller");

router.get("/profile", verifyToken, getprofileController);
router.put("/update/:username", verifyToken, updateProfileController);
router.put("/deactivate/:username", verifyToken, deactivateProfileController);
module.exports = router;
