// this file will fetch and return a single context details

const express = require("express");
const singleContextRoute = express.Router();

// general helpers
const isUserExist = require("../helpers/searchForUser");
const isContextExist = require("../helpers/searchForContext");

// library
const Joi = require("@hapi/joi");

const schema = Joi.object({
  uid: Joi.string().required(),
  contextId: Joi.string().required(),
});

singleContextRoute.post("/", async (req, res) => {
  const { uid, contextId } = req.body;

  // joi validation sbody data
  try {
    const validation = await schema.validateAsync({
      uid,
      contextId,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ message: error.message, code: "bad" });
  }

  // check if user exist
  const isUser = await isUserExist(uid);
  if (!isUser) {
    return res.status(404).json({
      message: "user not found",
      code: "bad",
    });
  }

  // search for the context
  const aContext = await isContextExist(contextId);
  if (!aContext) {
    return res.status(404).json({
      message: "context not found",
      code: "bad",
    });
  }

  return res.status(200).json({
    message: "successfully",
    code: "ok",
    payload: { data: aContext },
  });
});

module.exports = singleContextRoute;
