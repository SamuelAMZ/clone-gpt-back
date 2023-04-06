const express = require("express");
const userchatsRoute = express.Router();

// models
const DiscDetails = require("../../models/DiscDetails");
const Discussions = require("../../models/Discussions");

// library
const Joi = require("@hapi/joi");

const schema = Joi.object({
  uid: Joi.string().required(),
  page: Joi.string().required(),
  perPage: Joi.string().required(),
});

userchatsRoute.post("/", async (req, res) => {
  const { uid, page, perPage } = req.body;

  // joi validation sbody data
  try {
    const validation = await schema.validateAsync({
      uid,
      page,
      perPage,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ message: error.message, code: "bad" });
  }

  //   search for slug in discDetails collection
  try {
    const userChatsList = await DiscDetails.find({ uid: uid }, { slug: 1 })
      .sort({ createdAt: -1 })
      .skip(Number(page) * Number(perPage))
      .limit(Number(perPage));

    const count = await DiscDetails.find(
      { uid: uid },
      { slug: 1 }
    ).countDocuments();

    if (!userChatsList) {
      return res.status(400).json({
        message: `user chats not found`,
        code: "bad",
      });
    }

    return res.status(200).json({
      message: "user items loaded successfully",
      code: "ok",
      payload: { chats: userChatsList, count },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "something went wrong, retry later",
      code: "bad",
    });
  }
});

module.exports = userchatsRoute;
