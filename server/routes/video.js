const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const { Video } = require("../models/Video");
const { Subscriber } = require("../models/Subscriber");
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
    if (ext !== "mp4" && ext !== "webm") {
      return cb(res.status(400).end("only mp4, webm is allowed"), false);
    }
  },
});

const upload = multer({ storage: storage }).single("file");

router.get("/getvideo/:videoId", (req, res) => {
  const { videoId } = req.params;
  Video.findById(videoId)
    .populate("writer")
    .exec((err, video) => {
      if (err) return res.json({ success: false });
      res.status(200).json({ success: true, video });
    });
});

router.get("/getvideos", (req, res) => {
  Video.find()
    .populate("writer")
    .exec((err, videos) => {
      if (err) return res.status(400).json({ success: false, err });
      res.status(200).json({ success: true, videos });
    });
});

router.get("/getsubscriptionvideos/:userFrom", (req, res) => {
  const { userFrom } = req.params;
  Subscriber.find({ userFrom }).exec((err, subscribes) => {
    if (err) return res.status(400).json({ success: false, err });
    writerIds = subscribes.map((subscribe) => subscribe.userTo);
    Video.find({ writer: { $in: writerIds } })
      .populate("writer")
      .exec((err, videos) => {
        if (err) return res.status(400).json({ success: false, err });
        res.status(200).json({ success: true, videos });
      });
  });
});

router.post("/uploadfiles", (req, res) => {
  upload(req, res, (err) => {
    if (err) return res.json({ success: false, err });
    return res.json({
      success: true,
      url: res.req.file.path,
      fileName: "uploads/" + res.req.file.filename,
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

router.post("/uploadvideo", (req, res) => {
  const video = new Video(req.body);

  video.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    res.status(200).json({ success: true });
  });
});

module.exports = router;
