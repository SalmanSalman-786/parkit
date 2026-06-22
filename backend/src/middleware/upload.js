const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    if (req.originalUrl.includes("entry")) {
      cb(null, "uploads/entry");
    } else {
      cb(null, "uploads/exit");
    }

  },

  filename: (req, file, cb) => {

    const uniqueName =
      Date.now() + path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

module.exports = multer({ storage });