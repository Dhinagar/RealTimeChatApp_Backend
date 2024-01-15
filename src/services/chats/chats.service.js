const ChatRoomSchema = require("../../schemas/ChatRoomSchema");
const { resolvePromise } = require("../../utils/resolvePromise");
const MessagesSchema = require("../../schemas/messageSchema");

async function createChatroom(sourceUserName, destinationUserName) {
  try {
    const [errIsExits, isExits] = await resolvePromise(
      ChatRoomSchema.aggregate([
        {
          $match: {
            $or: [
              { user1: sourceUserName, user2: destinationUserName }, // Friend lists for the friend
              { user1: destinationUserName, user2: sourceUserName },
            ],
          }, // Pending friend requests for the user
        },
      ]).exec()
    );
    if (isExits && isExits.length > 0) {
      return {
        code: 200,
        data: {
          success: true,
          message: `You can chat now with ${destinationUserName}.`,
          chatRoom: isExits,
        },
      };
    }
    // Generate a unique chatroom ID (you can customize this according to your needs)
    const chatroomId = generateUniqueId();

    // Create a new chatroom
    const chatroom = new ChatRoomSchema({
      chatroomId,
      user1: sourceUserName,
      user2: destinationUserName,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Save the chatroom to the database
    const [err, room] = await resolvePromise(chatroom.save());
    if (err) {
      return {
        code: 401,
        data: {
          success: false,
          message: `You can not chat now with ${destinationUserName}. Pls try again after some time.`,
        },
      };
    }
    return {
      code: 200,
      data: {
        success: true,
        message: `You can chat now with ${destinationUserName}.`,
        chatRoom: room,
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

async function getAllMessagesForChatroom(chatroomId) {
  try {
    const [err, messages] = await resolvePromise(
      MessagesSchema.find({ roomId: chatroomId }) 
        .exec()
    );
    if (err) {
      throw err;
    }

    return {
      code: 200,
      data: {
        success: true,
        messages:messages,
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

async function sendmessage({
  sourceUserName,
  destinationUserName,
  chatroomId,
  message,
}) {
  try {
    // Generate a new message ID (you can customize this according to your needs)
    const messageId = generateUniqueId();

    // Find the highest order value for the given chat room and increment it
    const highestOrderMessage = await MessagesSchema.find({
      roomId: chatroomId,
    });

    const order = highestOrderMessage.length ? highestOrderMessage.length + 1 : 1;

    // Create a new message
    const newMessage = new MessagesSchema({
      messageId,
      from: sourceUserName,
      to: destinationUserName,
      order,
      message: message,
      roomId: chatroomId,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Save the message to the database
    const [err, messages] = await resolvePromise(newMessage.save());
    if (err) {
      return {
        code: 401,
        data: {
          success: false,
          message: "Message not sent yet.",
          error: err.message,
        },
      };
    }
    return {
      code: 200,
      data: {
        success: true,
        message: "Message sent.",
        mge: newMessage
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
function generateUniqueId() {
  const uuid = require("uuid");
  return uuid.v4();
}
module.exports = {
  createChatroom,
  getAllMessagesForChatroom,
  sendmessage,
};
