const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const { Comment } = require("../models/Comment");

router.post("/saveComment", (req, res) => {
  const comment = new Comment(req.body);
  comment.save((err, doc) => {
    if (err) return res.status(400).json({ success: false, err });
    Comment.populate(
      doc,
      { path: "writer", select: "_id image name" },
      (err, result) => {
        if (err) return res.status(400).json({ success: false, err });
        res.status(200).json({ success: true, comment: result });
      }
    );
  });
});

router.get("/getcomments/:videoId", (req, res) => {
  Comment.find({ postId: req.params.videoId })
    .populate("writer", "_id name image")
    .sort({ createdAt: 1 })
    .exec((err, comments) => {
      if (err) return res.status(400).json({ success: false, err });
      res.status(200).json({ success: true, comments });
    });
});

module.exports = router;
