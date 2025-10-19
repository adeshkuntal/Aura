const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Post = require("../models/Post");
const jwt = require("jsonwebtoken");
const multer = require("multer");

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
    const { userId, caption } = req.body;

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


router.put("/like/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.likes += 1; // increment like count
    await post.save();

    res.json({ success: true, likes: post.likes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});


// Logout route
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true });
});

module.exports = router;
