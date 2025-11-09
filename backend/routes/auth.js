const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Post = require("../models/Post");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const mongoose = require("mongoose");
const router = express.Router();

// Multer config (memory storage for MongoDB)
const storage = multer.memoryStorage();
const upload = multer({ storage });


router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hash,
      fullname: "",
      profilePic: {
        data: null,
        contentType: "",
      },
      bio: "enter your bio here ...",
      followedBy: [],
      isFollowing: [],
    });

    await newUser.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});



router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // set true in production with HTTPS
      sameSite: "lax",
    });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});




router.get("/me", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ user: null });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch full user data from DB
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ user: null });

    res.json({ user });
  } catch (err) {
    console.error("Error fetching /me:", err);
    res.status(401).json({ user: null });
  }
});




router.put("/updateprofile", upload.single("profilePic"), async (req, res) => {
  try {
    const { userId, bio, fullname } = req.body;

    const updateData = {};
    if (bio) updateData.bio = bio;
    if (fullname) updateData.fullname = fullname;

    if (req.file) {
      updateData.profilePic = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    console.error("Update failed", err);
    res.status(500).json({ error: "Update failed" });
  }
});




//Upload Post
router.post("/uploadPost", upload.single("file"), async (req, res) => {
  try {
    const { userId, caption, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const post = new Post({
      userId,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
      caption,
      description,
      likes: 0,
      comments: [],
    });

    await post.save();
    res.status(201).json({ message: "Post uploaded successfully", post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});



router.get("/getPosts", async (req, res) => {
  try {
    const userId = req.query.userId;
    const posts = await Post.find({ userId: userId });
    res.json({posts});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete("/deletePost", async (req, res) => {
  try {
    const { postId } = req.query;
    const deleted = await Post.findByIdAndDelete(postId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }
    res.json({ success: true, message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



router.put("/like", async (req, res) => {
  try {
    const { postId, Id } = req.query;
    if (!postId || !Id){
      return res.status(400).json({ success: false, message: "Missing IDs" });
    }
    const post = await Post.findById(postId);
    if (!post){
      return res.status(404).json({ success: false, message: "Post not found" });
    }
    post.likedBy = post.likedBy || [];
    const liked = post.likedBy.some((user) => user.toString() === Id);

    if (liked) {
      post.likedBy.pull(Id);
      post.likes = Math.max(post.likes - 1, 0);
    } else {
      post.likedBy.push(Id);
      post.likes = post.likes + 1;
    }

    await post.save();
    res.json({ success: true, likes: post.likes, isLiked: !liked });
  } catch (err) {
    console.error("Error in like:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



router.get("/isLiked", async (req, res) => {
  try {
    const { postId, Id } = req.query;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // ✅ Fix: likedBy array stores userIds directly (not objects)
    const isliked = post.likedBy.some(
      (user) => user.toString() === Id
    );

    res.json({ isliked });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.post("/addComment", async (req, res) => {
  try {
    const { postId, userId, text } = req.body;

    if (!postId || !userId || !text) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const post = await Post.findById(postId);

    post.comments = post.comments || [];
    post.comments.push({ userId, text });
    await post.save();
    res.status(201).json({ message: "Comment successfully added" });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: "Server error" });
  }
});



router.get("/getComment", async (req, res) => {
  try {
    const { postId } = req.query;

    const post = await Post.findById(postId).populate("comments.userId", "username"); 

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ comments: post.comments});
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ message: "Server error" });
  }
});



router.get("/getUsers", async (req, res) => {
  try {
    const { username } = req.query;
    const query = username
      ? { username: { $regex: '^' + username, $options: 'i' } } 
      : {};

    const users = await User.find(query).select('username'); 
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.get("/getUser/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/getPost/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const posts = await Post.find({ userId: id });
    res.json({ posts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.post("/follow", async (req, res) => {
  try {
    const { user1, user2 } = req.body;

    if (user1 === user2) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const User1 = await User.findById(user1);
    const User2 = await User.findById(user2);

    if (!User1 || !User2) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent duplicate follows
    if (User1.isFollowing.includes(user2)) {
      return res.status(400).json({ message: "Already following this user" });
    }

    User1.isFollowing.push(user2);
    User2.followedBy.push(user1);

    await User1.save();
    await User2.save();

    res.json({ success: true, message: "Followed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



router.post("/unfollow", async (req, res) => {
  try {
    const { user1, user2 } = req.body;

    const User1 = await User.findById(user1);
    const User2 = await User.findById(user2);

    if (!User1 || !User2) {
      return res.status(404).json({ message: "User not found" });
    }

    User1.isFollowing = User1.isFollowing.filter(
      (id) => id.toString() !== user2
    );
    User2.followedBy = User2.followedBy.filter(
      (id) => id.toString() !== user1
    );

    await User1.save();
    await User2.save();

    res.json({ success: true, message: "Unfollowed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



// Logout route
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true });
});

module.exports = router;
