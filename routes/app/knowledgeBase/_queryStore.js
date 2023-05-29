// this file will receive an input of a query and the userId, contextId, and search for the right data from pinecone

const express = require("express");
const queryStoreRoute = express.Router();

// helpers
const tokenizer = require("./tokenizer");
const contextEmbeddings = require("./embeddings");
const queryPinecone = require("./queryPinecone");

// general helpers
const isUserExist = require("../helpers/searchForUser");
const isContextExist = require("../helpers/searchForContext");

// library
const Joi = require("@hapi/joi");

const schema = Joi.object({
  uid: Joi.string().required(),
  query: Joi.string().required(),
  contextId: Joi.string().required(),
});

queryStoreRoute.post("/", async (req, res) => {
  const { uid, query, contextId } = req.body;

  // joi validation sbody data
  try {
    const validation = await schema.validateAsync({
      uid,
      query,
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

  // check text size
  const textSize = tokenizer(query, "querying");
  if (!textSize) {
    return res.status(400).json({
      message: "above the token limit 500",
      code: "bad",
    });
  }

  // embed chunks
  const embeddingsFromOpenAi = await contextEmbeddings([query]);

  //   querying pinecone
  const queryResponse = await queryPinecone(
    embeddingsFromOpenAi[0],
    uid,
    contextId
  );
  if (!queryResponse) {
    return res.status(400).json({
      message: "error querying vector db 001",
      code: "bad",
    });
  }

  return res.status(200).json({
    message: "successfully",
    code: "ok",
    payload: { data: queryResponse },
  });
});

module.exports = queryStoreRoute;
