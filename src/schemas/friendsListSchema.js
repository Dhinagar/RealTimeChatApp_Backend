// schemas/userSchema.js
const mongoose = require('mongoose');


const friendsListSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  friendUser: { type: String, required: true },
  requested_at: { type: Date, required: true },
  updated_at: { type: Date, required: true },
  accepted_at: { type: Date, required: false },
  declined_at: { type: Date, required: false },
  statusOf_req: { type: String, required: true },
  statusOf_friend: { type: String, enum: ['online', 'offline'], default: 'online' ,required: true }
});

const FriendList = mongoose.model('FriendList', friendsListSchema);

module.exports = FriendList;
