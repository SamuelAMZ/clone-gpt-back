const mongoose = require("mongoose");

const DiscDetails = new mongoose.Schema(
  {
    slug: {
      type: String,
    },
    title: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("discDetails", DiscDetails);
