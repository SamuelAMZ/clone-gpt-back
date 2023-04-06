const express = require("express");
const NewShareRoute = express.Router();

// models
const DiscDetails = require("../../models/DiscDetails");
const Discussions = require("../../models/Discussions");

// library
const Joi = require("@hapi/joi");

const schema = Joi.object({
  textFormat: Joi.array().required(),
  htmlFormat: Joi.array().required(),
  uid: Joi.string().required(),
  isPrivate: Joi.boolean().required(),
});

NewShareRoute.post("/", async (req, res) => {
  const { textFormat, htmlFormat, uid, isPrivate } = req.body;

  // joi validation sbody data
  try {
    const validation = await schema.validateAsync({
      textFormat,
      htmlFormat,
      uid,
      isPrivate,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message, code: "bad" });
    return;
  }

  let timestamp = Date.now();
  const title = textFormat[0];
  const slug = `${textFormat[0].replaceAll(" ", "-")}-${timestamp}`;

  //   creating new share
  const aShare = new DiscDetails({
    uid: uid,
    title: title,
    slug: encodeURIComponent(slug.toLowerCase()),
    isPrivate: isPrivate,
  });

  //   save
  try {
    await aShare.save();

    // add url
    aShare.url = `${process.env.PUBLINK}/disc/${aShare.slug}`;
    await aShare.save();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error when scraping",
      code: "500",
    });
  }

  // add all discussion data
  for (let i = 0; i < htmlFormat.length; i++) {
    const aShareBlock = new Discussions({
      discId: aShare._id,
      textFormat: textFormat[i],
      htmlFornat: htmlFormat[i],
    });

    await aShareBlock.save();
  }

  try {
    return res.status(201).json({
      message: "added successfully",
      code: "ok",
      payload: { url: aShare.url },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error when scraping",
      code: "500",
    });
  }
});

module.exports = NewShareRoute;
