const mongoose = require("mongoose");

const Discussions = new mongoose.Schema(
  {
    discId: {
      type: String,
    },
    textFormat: {
      type: String,
    },
    htmlFornat: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("discussions", Discussions);
