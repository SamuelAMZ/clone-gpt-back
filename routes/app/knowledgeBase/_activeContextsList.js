// fetch a list of active contexts of the user

const express = require("express");
const activeContextsListRoute = express.Router();

// models
const Contexts = require("../../../models/Contexts");

// library
const Joi = require("@hapi/joi");

const schema = Joi.object({
  uid: Joi.string().required(),
});

activeContextsListRoute.post("/", async (req, res) => {
  const { uid } = req.body;
  let page = "0";
  let perPage = "10";

  // joi validation sbody data
  try {
    const validation = await schema.validateAsync({
      uid,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ message: error.message, code: "bad" });
  }

  //   search for slug in contexts collection
  try {
    const contextsList = await Contexts.find(
      { uid: uid, state: true },
      { name: 1, state: 1, module: 1 }
    )
      .sort({ updateAt: -1 })
      .skip(Number(page) * Number(perPage))
      .limit(Number(perPage));

    const count = await Contexts.find(
      { uid: uid, state: true },
      { name: 1 }
    ).countDocuments();

    if (!contextsList) {
      return res.status(404).json({
        message: `active contexts not found`,
        code: "bad",
      });
    }

    return res.status(200).json({
      message: "active contexts loaded successfully",
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

module.exports = activeContextsListRoute;
