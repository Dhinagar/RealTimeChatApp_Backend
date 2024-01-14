// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registerUserController, loginUserController,logoutUserController } = require('../controllers/auth.controller');
const { verifyToken } = require('../auth/authMiddleware');

router.post('/register', registerUserController);

router.post('/login', loginUserController);
router.put('/logout/:username',verifyToken, logoutUserController);

module.exports = router;
