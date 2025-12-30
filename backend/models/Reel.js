const mongoose = require("mongoose");

const reelSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
    },
    description: {
        type: String,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: String
    }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reel", reelSchema);
