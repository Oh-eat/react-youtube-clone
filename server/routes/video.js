const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");

// const { Video } = require("../models/Video");
const { auth } = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "server/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  filefilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== "mp4") {
      return cb(res.status(400).end("only mp4 is allowed"), false);
    }
  },
});

const upload = multer({ storage: storage }).single("file");

router.post("/uploadfiles", (req, res) => {
  upload(req, res, (err) => {
    if (err) return res.json({ success: false, err });
    return res.json({
      success: true,
      url: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

module.exports = router;
