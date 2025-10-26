const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true },
  password: { type: String, required: true },
  fullname: { type: String },
  profilePic: {
    data: Buffer,
    contentType: String,
  },
  bio: { type: String, required: true },
  followedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  isFollowing: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("User", userSchema);
