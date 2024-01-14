const friendsListSchema = require("../../schemas/friendsListSchema");
const { resolvePromise } = require("../../utils/resolvePromise");
const { friendRequestEnumStatus } = require("./friendsReqStatus.enum");

async function raiseFriendRequest(sourceUserName, destinationUserName) {
  try {
    const [err, friend] = await resolvePromise(
      friendsListSchema.findOne({
        userName: sourceUserName,
        friendUser: destinationUserName,
      })
    );
    if (err) {
      throw err;
    }
    if (friend) {
      return {
        code: 200,
        data: {
          success: true,
          message: `Hey ${sourceUserName}, you are already friend with ${destinationUserName}.`,
        },
      };
    }
    const date = new Date();
    const newrequest = new friendsListSchema({
      userName: destinationUserName,
      friendUser: sourceUserName,
      requested_at: date,
      updated_at: date,
      accepted_at: null,
      statusOf_req: friendRequestEnumStatus.PENDING,
      statusOf_friend: "online",
    });
    const [errRequest, request] = await resolvePromise(newrequest.save());
    if (errRequest) {
      return {
        code: 201,
        data: {
          success: false,
          message: "Your Request failed. pls try again after some time.",
          error: errRequest,
        },
      };
    }
    return {
      code: 200,
      data: {
        success: true,
        message: "Requested successfully.",
      },
    };
  } catch (error) {
    return {
      code: 401,
      data: {
        success: false,
        message: "Your Request failed. pls try again after some time.",
        error: error.message,
      },
    };
  }
}
async function acceptFriendRequest(sourceUserName, destinationUserName) {
  try {
    const [err, friend] = await resolvePromise(
      friendsListSchema.findOne({
        userName: sourceUserName,
        friendUser: destinationUserName,
        statusOf_req: friendRequestEnumStatus.PENDING,
      })
    );
    if (err) {
      throw err;
    }
    if (!friend) {
      return {
        code: 200,
        data: {
          success: true,
          message: `Hey ${sourceUserName}, you are not raised the friend requested with ${destinationUserName}.`,
        },
      };
    }
    const date = new Date();
    friend.statusOf_req = friendRequestEnumStatus.FRIENDS;
    friend.accepted_at = date;
    friend.updated_at = date;
    const [errAccept, accept] = await resolvePromise(friend.save());
    if (errAccept) {
      return {
        code: 201,
        data: {
          success: false,
          message: "Pls try again after some time.",
          error: errAccept,
        },
      };
    }
    return {
      code: 200,
      data: {
        success: true,
        message: "Accepted successfully.",
      },
    };
  } catch (error) {
    return {
      code: 401,
      data: {
        success: false,
        message: "Pls try again after some time.",
        error: error.message,
      },
    };
  }
}

async function declineFriendRequest(sourceUserName, destinationUserName) {
  try {
    const [err, friend] = await resolvePromise(
      friendsListSchema.findOne({
        userName: sourceUserName,
        friendUser: destinationUserName,
        statusOf_req: friendRequestEnumStatus.PENDING,
      })
    );
    if (err) {
      throw err;
    }
    if (!friend) {
      return {
        code: 200,
        data: {
          success: true,
          message: `Hey ${sourceUserName}, you are not raised the friend requested with ${destinationUserName}.`,
        },
      };
    }
    const date = new Date();
    friend.statusOf_req = friendRequestEnumStatus.DECLINED;
    friend.declined_at = date;
    friend.updated_at = date;
    const [errAccept, accept] = await resolvePromise(friend.save());
    if (errAccept) {
      return {
        code: 201,
        data: {
          success: false,
          message: "Pls try again after some time.",
          error: errAccept,
        },
      };
    }
    return {
      code: 200,
      data: {
        success: true,
        message: "Accepted successfully.",
      },
    };
  } catch (error) {
    return {
      code: 401,
      data: {
        success: false,
        message: "Pls try again after some time.",
        error: error.message,
      },
    };
  }
}
module.exports = {
  raiseFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
};
