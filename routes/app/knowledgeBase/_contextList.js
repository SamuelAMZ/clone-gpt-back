// fetch a list of contexts of the user

const express = require("express");
const contextsListRoute = express.Router();

// models
const Contexts = require("../../../models/Contexts");

// library
const Joi = require("@hapi/joi");

const schema = Joi.object({
  uid: Joi.string().required(),
  page: Joi.string().required(),
  perPage: Joi.string().required(),
});

contextsListRoute.post("/", async (req, res) => {
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

  //   search for slug in contexts collection
  try {
    const contextsList = await Contexts.find(
      { uid: uid, state: false },
      { state: 1, name: 1, module: 1 }
    )
      .sort({ createdAt: -1 })
      .skip(Number(page) * Number(perPage))
      .limit(Number(perPage));

    const count = await Contexts.find(
      { uid: uid },
      { slug: 1 }
    ).countDocuments();

    if (!contextsList) {
      return res.status(404).json({
        message: `contexts not found`,
        code: "bad",
      });
    }

    return res.status(200).json({
      message: "contexts loaded successfully",
      code: "ok",
      payload: { contexts: contextsList, count },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "something went wrong, retry later",
      code: "bad",
    });
  }
});

module.exports = contextsListRoute;
