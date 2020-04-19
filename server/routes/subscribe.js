const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const { Subscriber } = require("../models/Subscriber");

router.post("/subscribenumber", (req, res) => {
  Subscriber.find({ userTo: req.body.userTo }).exec((err, subscribers) => {
    if (err) res.status(400).json({ success: false, err });
    return res
      .status(200)
      .json({ success: true, subscriberNumber: subscribers.length });
  });
});

router.post("/subscribed", (req, res) => {
  const { userTo, userFrom } = req.body;
  Subscriber.find({ userTo, userFrom }).exec((err, subscribed) => {
    if (err) res.status(400).json({ success: false, err });
    res.status(200).json({
      success: true,
      subscribed: subscribed.length > 0 ? true : false,
    });
  });
});

router.post("/subscribe", (req, res) => {
  const subscriber = new Subscriber(req.body);
  subscriber.save((err, doc) => {
    if (err) res.status(400).json({ success: false, err });
    res.status(200).json({ success: true, doc });
  });
});

router.post("/unsubscribe", (req, res) => {
  const { userTo, userFrom } = req.body;

  Subscriber.findOneAndDelete({ userTo, userFrom }).exec((err, result) => {
    if (err) return res.status(400).json({ success: false, err });
    res.status(200).json({ success: true, result });
  });
});

module.exports = router;
