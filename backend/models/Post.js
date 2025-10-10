const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  image: {
    data: Buffer,
    contentType: String,
  },
  caption: String,
  likes: { type: Number, default: 0 },
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: String
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);
