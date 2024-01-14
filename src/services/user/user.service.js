// services/userService.js
const User = require("../../schemas/userSchema");
const FriendList = require("../../schemas/friendsListSchema");
const { resolvePromise } = require("../../utils/resolvePromise");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

async function registerUser(userDetails) {
  try {
    const user = new User(userDetails);
    const [err, success] = await resolvePromise(user.save());
    if (err) {
      return {
        code: 409,
        data: {
          success: false,
          message: "Registration failed",
          error: err.message,
        },
      };
    }
    return {
      code: 200,
      data: { success: true, message: "User registered successfully" },
    };
  } catch (error) {
    return {
      code: 400,
      data: {
        success: false,
        message: "Registration failed",
        error: error.message,
      },
    };
  }
}

async function loginUser(username, password) {
  try {
    const [err, user] = await resolvePromise(
      User.findOne({ userName: username })
    );
    const [errFriendStatus, friendStatus] = await resolvePromise(
      FriendList.findOne({ friendUser: username })
    );
    if (err) {
      throw err;
    }
    if (errFriendStatus) {
      throw err;
    }
    if (!user) {
      return {
        code: 404,
        data: {
          success: false,
          message: "User not found.",
        },
      };
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return {
        code: 213,
        data: {
          success: false,
          message: "Invalid password.",
        },
      };
    }
    // Update lastLoggedIn and status
    user.lastLoggedIn = new Date();
    user.status = "online";
    await user.save();

    if (friendStatus) {
      friendStatus.statusOf_friend = "online";
      await friendStatus.save();
    }

    return { code: 200, data: { success: true, token: generateToken(user) } };
  } catch (error) {
    return {
      code: 401,
      data: {
        success: false,
        message: "Authentication failed",
        error: error.message,
      },
    };
  }
}

function generateToken(user) {
  return jwt.sign({ username: user.userName }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
}

async function logout(username) {
  try {
    const [err, user] = await resolvePromise(
      User.findOne({ userName: username })
    );

    if (err || !user) {
      return {
        code: 404,
        data: {
          success: false,
          message: "User not found.",
        },
      };
    }

    // Update status to 'offline'
    user.status = "offline";
    await user.save();
  } catch (error) {
    return {
      code: 401,
      data: {
        success: false,
        message: "logout failed.",
      },
    };
  }
}
module.exports = { registerUser, loginUser, logout };
