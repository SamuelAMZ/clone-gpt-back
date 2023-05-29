const mongoose = require("mongoose");

const Contexts = new mongoose.Schema(
  {
    uid: {
      type: String,
    },
    name: {
      type: String,
    },
    used: {
      type: Number,
      default: 0,
    },
    size: {
      type: Number,
    },
    module: {
      type: String,
    },
    preview: {
      type: String,
    },
    previewLink: {
      type: String,
      default: "",
    },
    state: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("contexts", Contexts);
