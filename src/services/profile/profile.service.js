const User = require("../../schemas/userSchema");
const FriendsListSchema = require("../../schemas/friendsListSchema");
const ChatRoomSchema = require("../../schemas/ChatRoomSchema");
const { resolvePromise } = require("../../utils/resolvePromise");

async function getProfileData(username) {
  try {
    const [err, user] = await resolvePromise(User.findOne({ name: username }));
    if (err) {
      throw err;
    }
    if (!user) {
      return {
        code: 310,
        data: {
          success: true,
          message: "Profile not found",
          data: user,
        },
      };
    }
    return {
      code: 200,
      data: {
        success: true,
        message: "get Profile Data successfully",
        data: user,
      },
    };
  } catch (error) {
    return {
      code: 401,
      data: {
        success: false,
        message: "get Profile Data failed",
        error: error.message,
      },
    };
  }
}
async function getAllProfileData(userName) {
  try {
    const [err, users] = await resolvePromise(User.find({}));

    const [errChtatrooms, chatrooms] = await resolvePromise(
      ChatRoomSchema.aggregate([
        {
          $match: {
            $or: [{ user1: userName }, { user2: userName }],
          },
        },
      ]).exec()
    );

    let friendList = await FriendsListSchema.aggregate([
      {
        $match: {
          $or: [
            { friendUser: userName, statusOf_req: "friends" }, // Friend lists for the friend
            { userName: userName, statusOf_req: "friends" },
          ],
        }, // Pending friend requests for the user
      },
      {
        $lookup: {
          from: "users", // Name of the users collection
          localField: "userName",
          foreignField: "userName",
          as: "userDetails",
        },
      },
    ]).exec();
    friendList = friendList.filter((item) => item.friendUser === userName);

    const friendRequested = await FriendsListSchema.aggregate([
      {
        $match: { userName: userName, statusOf_req: "Pending" }, // Pending friend requests for the user
      },
      {
        $lookup: {
          from: "users", // Name of the users collection
          localField: "friendUser",
          foreignField: "userName",
          as: "userDetails",
        },
      },
    ]).exec();
    
    const otherUsers = await User.aggregate([
      {
        $match: {
          userName: { $ne: userName },
        },
      },
    ]);

    let filteredOtherUsers = otherUsers.filter((user) => {
      return !friendRequested.some(
        (request) => request.friendUser === user.userName
      );
    });

    filteredOtherUsers = filteredOtherUsers.filter((user) => {
      return !friendList.some((friend) => friend.userName === user.userName);
    });

    if (err) {
      throw err;
    }
    if (!users) {
      return {
        code: 310,
        data: {
          success: true,
          message: "No Profiles not found",
        },
      };
    }
    return {
      code: 200,
      data: {
        success: true,
        message: "get all Profiles Data successfully",
        data: {
          chatrooms,
          friendList,
          friendRequested,
          others: filteredOtherUsers,
          allusers: users,
        },
      },
    };
  } catch (error) {
    return {
      code: 401,
      data: {
        success: false,
        message: "get All Profiles Data failed",
        error: error.message,
      },
    };
  }
}
async function updateProfileData(username, updatedDetails) {
  try {
    const [err, Profile] = await resolvePromise(
      User.findOneAndUpdate({ userName: username }, updatedDetails, {
        new: true,
      })
    );

    if (err) {
      return {
        code: 500,
        data: {
          success: false,
          message: "Profile update failed",
          error: err.message,
        },
      };
    }

    if (!Profile) {
      return {
        code: 404,
        data: {
          success: false,
          message: "Profile not found",
        },
      };
    }

    return {
      code: 200,
      data: { success: true, message: "Profile updated successfully", Profile },
    };
  } catch (error) {
    return {
      code: 400,
      data: {
        success: false,
        message: "Update failed",
        error: error.message,
      },
    };
  }
}

async function deactivateProfile(username, requestingUsername) {
  try {
    if (username !== requestingUsername) {
      return {
        code: 403,
        data: {
          success: false,
          message: "You don't have permission to deactivate this account",
        },
      };
    }

    const [err, profile] = await resolvePromise(
      User.findOneAndUpdate(
        { userName: username },
        { isActive: false, status: "offline" },
        { new: true }
      )
    );

    if (err) {
      return {
        code: 500,
        data: {
          success: false,
          message: "Deactivation failed",
          error: err.message,
        },
      };
    }

    if (!profile) {
      return {
        code: 404,
        data: {
          success: false,
          message: "profile not found",
        },
      };
    }

    return {
      code: 200,
      data: {
        success: true,
        message: "Your Profile deactivated successfully",
        user: profile,
      },
    };
  } catch (error) {
    return {
      code: 400,
      data: {
        success: false,
        message: "Deactivation failed",
        error: error.message,
      },
    };
  }
}

module.exports = {
  getProfileData,
  updateProfileData,
  deactivateProfile,
  getAllProfileData,
};
