// this file will set the targeted job to done

const express = require("express");
const setJobstatusToDoneRoute = express.Router();

// model
const ScrapingJobs = require("../../../models/ScrapingJobs");

// library
const Joi = require("@hapi/joi");

const schema = Joi.object({
  jobId: Joi.string().required(),
});

setJobstatusToDoneRoute.post("/", async (req, res) => {
  const { jobId } = req.body;

  // joi validation sbody data
  try {
    const validation = await schema.validateAsync({
      jobId,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ message: error.message, code: "bad" });
  }

  // search for the job
  const aJob = await ScrapingJobs.findOne({ _id: jobId });
  if (!aJob) {
    return res.status(404).json({
      message: "job not found",
      code: "bad",
    });
  }

  //  update job
  aJob.status = true;
  try {
    await aJob.save();
  } catch (error) {
    console.log(error);
  }

  //   send response
  return res.status(201).json({
    message: "successfully",
    code: "ok",
    payload: { status: "done" },
  });
});

module.exports = setJobstatusToDoneRoute;
