const {
  createChatroom,
  getAllMessagesForChatroom,
  sendmessage
} = require("../services/chats/chats.service");

const createChatroomController = async (req, res) => {
  const { sourceUserName, destinationUserName } = req.body;
  const result = await createChatroom(sourceUserName, destinationUserName);
  res.status(result.code).json(result.data);
};
const getAllMessagesForChatroomController = async (req, res) => {
  const { chatroomId } = req.params;
  const result = await getAllMessagesForChatroom(
    chatroomId
  );
  res.status(result.code).json(result.data);
};
const sendmessageController = async (req, res) => {
  const result = await sendmessage(
    req.body
  );
  res.status(result.code).json(result.data);
};
module.exports = {
  createChatroomController,
  getAllMessagesForChatroomController,
  sendmessageController
};
