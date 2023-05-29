// this file will receive as an input, an array of embeddings (vectors) and add them to pineconedb
// this file will get in input of row text and will send back an output of an array of chunck of text
const express = require("express");
const addToStoreRoute = express.Router();

// helpers
const chunker = require("./chunks");
const tokenizer = require("./tokenizer");
const contextEmbeddings = require("./embeddings");
const addToPinecone = require("./upsertPinecone");
const newContext = require("./createContextDb");

// general helpers
const isUserExist = require("../helpers/searchForUser");

// library
const Joi = require("@hapi/joi");

const schema = Joi.object({
  uid: Joi.string().required(),
  rawText: Joi.string().required(),
  module: Joi.string().required(),
  name: Joi.string().required(),
});

addToStoreRoute.post("/", async (req, res) => {
  const { uid, rawText, module, name } = req.body;

  // joi validation sbody data
  try {
    const validation = await schema.validateAsync({
      uid,
      rawText,
      module,
      name,
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

  // check text size
  const textSize = tokenizer(rawText, "upserting");
  if (!textSize) {
    return res.status(400).json({
      message: "above the token limit 10k",
      code: "bad",
    });
  }

  // chunk texts
  const chunks = await chunker(rawText);

  // create db record for the context
  const contextId = await newContext({
    uid,
    name,
    size: textSize,
    module,
    preview: rawText.slice(0, 150),
  });
  if (!contextId) {
    return res.status(500).json({
      message: "error creating a new context 001",
      code: "bad",
    });
  }

  // chunk array of each
  let chunksArray = [];
  // retrieve textContent
  chunks.forEach((elm) => {
    if (elm.pageContent) {
      chunksArray.push(elm.pageContent);
    }
  });

  // embed chunks
  const embeddingsFromOpenAi = await contextEmbeddings(chunksArray);

  // store embeds into vector db
  const metadata = {
    uid,
    contextId,
    module,
  };

  let chunkSourceInfo = [];
  for (let i = 0; i < chunks.length; i++) {
    if (chunks[i].metadata) {
      chunkSourceInfo.push(chunks[i].metadata);
    }
  }

  let resFromPinecone = await addToPinecone(
    embeddingsFromOpenAi,
    chunkSourceInfo,
    metadata,
    chunksArray
  );
  if (!resFromPinecone) {
    return res.status(500).json({
      message: "error creating a new context 002",
      code: "bad",
    });
  }

  return res.status(200).json({
    message: "successfully",
    code: "ok",
    payload: { data: resFromPinecone, contextId: contextId },
  });
});

module.exports = addToStoreRoute;
