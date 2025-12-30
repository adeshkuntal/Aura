const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Only video files allowed"), false);
  }
};

const uploadReel = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter,
});

module.exports = uploadReel;
