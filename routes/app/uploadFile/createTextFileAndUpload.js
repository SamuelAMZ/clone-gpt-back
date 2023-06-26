// this will create a text file base on the rawText and then upload it to the bucket
const express = require("express");
const createAndUploadText = express.Router();

// helpers
const createAndUploadTextFile = require("./uploadTextFileHelper");

// library
const Joi = require("@hapi/joi");

const schema = Joi.object({
  fileContent: Joi.string().required(),
});

createAndUploadText.post("/", async (req, res) => {
  const { fileContent } = req.body;

  // joi validation sbody data
  try {
    const validation = await schema.validateAsync({
      fileContent,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message, code: "bad" });
    return;
  }

  const { url, name } = await createAndUploadTextFile(fileContent);

  // send response
  res.status(201).json({ url, name });
});

module.exports = createAndUploadText;
