// auth/authMiddleware.js
const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "invalid token" });
    }
    req.user = user;
    next();
  });
}

function VerifySocketToken(socket, next) {
  const token = socket.handshake.auth.token;
  if (!token) {
    console.log("socket Internal Error");
    return next(new Error("Unauthorized"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("socket Internal Error");
      return next(new Error("Internal Error"));
    }
    socket.user = user;
    return next();
  });
}

module.exports = { verifyToken, VerifySocketToken };
