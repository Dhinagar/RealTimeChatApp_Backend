const {
  raiseFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
} = require("../services/friends/friendsrequests.service");

const raiseFriendRequestController = async (req, res) => {
  const { sourceUserName, destinationUserName } = req.body;
  const result = await raiseFriendRequest(sourceUserName, destinationUserName);
  res.status(result.code).json(result.data);
};
const acceptFriendRequestController = async (req, res) => {
  const { sourceUserName, destinationUserName } = req.body;
  const result = await acceptFriendRequest(sourceUserName, destinationUserName);
  res.status(result.code).json(result.data);
};

const declineFriendRequestController = async (req, res) => {
  const { sourceUserName, destinationUserName } = req.body;
  const result = await declineFriendRequest(
    sourceUserName,
    destinationUserName
  );
  res.status(result.code).json(result.data);
};
module.exports = {
  raiseFriendRequestController,
  acceptFriendRequestController,
  declineFriendRequestController,
};
