const express = require("express");
const getJobDataRoute = express.Router();

// model
const ScrapingJobs = require("../../../models/ScrapingJobs");

// library
const Joi = require("@hapi/joi");

const schema = Joi.object({
  jobId: Joi.string().required(),
});

getJobDataRoute.post("/", async (req, res) => {
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

  //   send response
  return res.status(201).json({
    message: "successfully",
    code: "ok",
    payload: { job: aJob },
  });
});

module.exports = getJobDataRoute;
