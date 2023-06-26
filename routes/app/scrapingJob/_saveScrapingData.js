// this file will save scraping data in txt file to gcp bucket sent from the extension, will create the file if not already exist and update if already

const express = require("express");
const saveScrapingJobData = express.Router();

// model
const ScrapingJobs = require("../../../models/ScrapingJobs");

// helpers
const fetchFileAndParseContent = require("../knowledgeBase/parseText");
const createAndUploadTextFile = require("../uploadFile/uploadTextFileHelper");

// library
const Joi = require("@hapi/joi");

const schema = Joi.object({
  jobId: Joi.string().required(),
  scrapeContent: Joi.string().required(),
});

saveScrapingJobData.post("/", async (req, res) => {
  const { jobId, scrapeContent } = req.body;

  // joi validation sbody data
  try {
    const validation = await schema.validateAsync({
      jobId,
      scrapeContent,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ message: error.message, code: "bad" });
  }

  // get job
  const aJob = await ScrapingJobs.findOne({ _id: jobId });
  if (!aJob) {
    return res.status(404).json({
      message: "job not found",
      code: "bad",
    });
  }

  //   let file content
  let fileContent = "";

  // if file not present,
  if (!aJob.endFile || !aJob.endFile.length > 1) {
    // create file txt with the actual content
    fileContent = scrapeContent;
  }

  //   if file exist
  if (aJob.endFile && aJob.endFile.length > 1) {
    // parse existing file
    let oldContent = await fetchFileAndParseContent(aJob.endFile, "txt");

    // append actual data
    let mixedContent = `${oldContent} \n --- \n ${scrapeContent}`;

    // create file
    fileContent = mixedContent;
  }

  // save file to gcp storage
  const { url, name } = await createAndUploadTextFile(fileContent);

  // update job file url
  aJob.endFile = url;
  try {
    await aJob.save();
  } catch (error) {
    console.log(error);
  }

  //   send response
  return res.status(201).json({
    message: "successfully",
    code: "ok",
    payload: { saved: "true" },
  });
});

module.exports = saveScrapingJobData;
