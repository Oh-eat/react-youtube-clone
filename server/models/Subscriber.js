const mongoose = require("mongoose");

const subscriberSchema = mongoose.Schema(
  {
    userTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    userFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

const Subscriber = mongoose.model("Subscriber", subscriberSchema);

module.exports = { Subscriber };
