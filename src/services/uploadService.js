const multer = require("multer");
const path = require("path");

// Create the uploads folder if it doesn't exist
const fs = require("fs");
const uploadsDir = "./uploads";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure storage options for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the directory to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use a timestamp to avoid name conflicts
  },
});

const upload = multer({ storage: storage });

module.exports = {
  upload,
};
