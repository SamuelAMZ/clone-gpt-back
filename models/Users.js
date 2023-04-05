const mongoose = require("mongoose");

const Users = new mongoose.Schema(
  {
    uid: {
      type: String,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", Users);
