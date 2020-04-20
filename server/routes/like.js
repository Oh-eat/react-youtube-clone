const express = require("express");
const router = express.Router();
const { Like } = require("../models/Like");
const { Dislike } = require("../models/Dislike");

router.post("/status", (req, res) => {
  const { userId, commentId, videoId } = req.body;
  const query = {
    ...(commentId ? { commentId } : {}),
    ...(videoId ? { videoId } : {}),
  };
  Promise.all([
    Like.find(query).countDocuments().exec(),
    Dislike.find(query).countDocuments().exec(),
    Like.findOne({ userId, ...query })
      .countDocuments()
      .exec(),
    Dislike.findOne({ userId, ...query })
      .countDocuments()
      .exec(),
  ])
    .then((response) => {
      const [like, dislike, liked, disliked] = response;
      res.status(200).json({
        success: true,
        like,
        dislike,
        selected: liked > 0 ? "like" : disliked > 0 ? "dislike" : null,
      });
    })
    .catch((err) => {
      res.status(400).json({ success: false, err });
    });
});

router.post("/clear", (req, res) => {
  const { type, userId, commentId, videoId } = req.body;
  const Model = type === "like" ? Like : Dislike;
  const query = {
    userId,
    ...(commentId ? { commentId } : {}),
    ...(videoId ? { videoId } : {}),
  };
  Model.findOneAndDelete(query).exec((err, response) => {
    if (err) return res.status(400).json({ success: false, err });
    res.status(200).json({ success: true });
  });
});

router.post("/set", (req, res) => {
  const { type, userId, commentId, videoId } = req.body;
  const Model = type === "like" ? Like : Dislike;
  const query = {
    userId,
    ...(commentId ? { commentId } : {}),
    ...(videoId ? { videoId } : {}),
  };
  const model = new Model(query);
  model.save((err, doc) => {
    if (err) return res.status(400).json({ success: false, err });
    res.status(200).json({ success: true });
  });
});

router.post("/toggle", (req, res) => {
  const { type, userId, commentId, videoId } = req.body;
  const [PrevModel, NextModel] =
    type === "like" ? [Dislike, Like] : [Like, Dislike];
  const query = {
    userId,
    ...(commentId ? { commentId } : {}),
    ...(videoId ? { videoId } : {}),
  };
  Promise.all([
    PrevModel.findOneAndDelete(query).exec(),
    new NextModel(query).save(),
  ])
    .then((response) => {
      res.status(200).json({ success: true });
    })
    .catch((err) => {
      res.status(400).json({ success: false, err });
    });
});

module.exports = router;
