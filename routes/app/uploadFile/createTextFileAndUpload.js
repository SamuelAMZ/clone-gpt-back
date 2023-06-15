// this will create a text file base on the rawText and then upload it to the bucket
const express = require("express");
const createAndUploadText = express.Router();

// gcp storage
const { Storage } = require("@google-cloud/storage");

// node apis
const url = require("url");

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

  //   create file
  // upload file
  const storage = new Storage();
  const bucketName = "contexts_storage";
  const bucket = storage.bucket(bucketName);
  const fileName = `${Date.now()}-contextfile.txt`;
  const file = bucket.file(fileName);
  await file.save(fileContent, { contentType: "text/plain" });

  const uploadedFileName = file.name;
  const fileUrl = `https://storage.googleapis.com/${bucketName}/${uploadedFileName}`;

  const parsedUrl = url.parse(fileUrl);
  const transformedUrl = `${parsedUrl.protocol}//${parsedUrl.host}${parsedUrl.pathname}`;

  // send response
  res.status(201).json({ url: transformedUrl, name: uploadedFileName });
});

module.exports = createAndUploadText;
