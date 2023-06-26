const mongoose = require("mongoose");

const ScrapingJobs = new mongoose.Schema(
  {
    uid: {
      type: String,
    },
    type: {
      type: String,
    },
    links: {
      type: Array,
    },
    endFile: {
      type: String,
      default: "",
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("scrapingJobs", ScrapingJobs);
