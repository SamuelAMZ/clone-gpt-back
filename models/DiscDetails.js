const mongoose = require("mongoose");

const DiscDetails = new mongoose.Schema(
  {
    uid: {
      type: String,
    },
    slug: {
      type: String,
    },
    title: {
      type: String,
    },
    url: {
      type: String,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("discDetails", DiscDetails);
