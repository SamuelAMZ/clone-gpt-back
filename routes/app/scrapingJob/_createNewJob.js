// this file will create a new web scraping job

const express = require("express");
const createNewJobRoute = express.Router();

// model
const ScrapingJobs = require("../../../models/ScrapingJobs");

// library
const Joi = require("@hapi/joi");

const schema = Joi.object({
  uid: Joi.string().required(),
  type: Joi.string().required(),
  links: Joi.array().required(),
});

createNewJobRoute.post("/", async (req, res) => {
  const { uid, type, links } = req.body;

  // joi validation sbody data
  try {
    const validation = await schema.validateAsync({
      uid,
      type,
      links,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ message: error.message, code: "bad" });
  }

  //   create job
  const newJob = new ScrapingJobs({
    uid,
    type,
    links,
  });

  try {
    await newJob.save();
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: "error create new job", code: "bad" });
  }

  //   send response
  return res.status(201).json({
    message: "successfully",
    code: "ok",
    payload: { jobId: newJob._id },
  });
});

module.exports = createNewJobRoute;
