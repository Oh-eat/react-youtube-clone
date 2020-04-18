const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
// const { Video } = require("../models/Video");
const { auth } = require("../middleware/auth");
const BASE_PATH = "server/uploads";

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

router.post("/thumbnail", (req, res) => {
  ffmpeg.ffprobe(req.body.url, function (err, metadata) {
    fileDuration = metadata.format.duration;
  });

  ffmpeg(req.body.url)
    .on("filenames", function (filenames) {
      filePath = `uploads/thumbnails/` + filenames[0];
    })
    .on("end", function () {
      return res.json({
        success: true,
        url: filePath,
        fileDuration: fileDuration,
      });
    })
    .on("error", function (err) {
      return res.json({ success: false, err });
    })
    .screenshot({
      count: 3,
      folder: `server/uploads/thumbnails`,
      size: "320x240",
      filename: "thumbnail-%b.png",
    });
});

module.exports = router;
