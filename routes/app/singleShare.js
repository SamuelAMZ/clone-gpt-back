const express = require("express");
const SingleShareRoute = express.Router();

// models
const DiscDetails = require("../../models/DiscDetails");
const Discussions = require("../../models/Discussions");

// library
const Joi = require("@hapi/joi");

const schema = Joi.object({
  id: Joi.string().required(),
  page: Joi.string().required(),
  perPage: Joi.string().required(),
});

SingleShareRoute.post("/", async (req, res) => {
  const { id, page, perPage } = req.body;

  // joi validation sbody data
  try {
    const validation = await schema.validateAsync({
      id,
      page,
      perPage,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ message: error.message, code: "bad" });
  }

  //   search for slug in discDetails collection
  try {
    const singleShare = await DiscDetails.findOne({ _id: id });
    if (!singleShare) {
      return res.status(400).json({
        message: `single share not found`,
        code: "bad",
      });
    }

    // then extract share id
    const shareId = singleShare._id;

    // then search for share id in discussion col with the pagination
    const shareItems = await Discussions.find(
      {
        discId: shareId,
      },
      { htmlFornat: 1, textFormat: 1 }
    )
      .sort([["createdAt", 1]])
      .skip(Number(page) * Number(perPage))
      .limit(Number(perPage));

    if (!shareItems) {
      return res.status(400).json({
        message: `share items not found`,
        code: "bad",
      });
    }

    return res.status(200).json({
      message: "share items loaded successfully",
      code: "ok",
      payload: { shares: shareItems },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "something went wrong, retry later",
      code: "bad",
    });
  }
});

module.exports = SingleShareRoute;
