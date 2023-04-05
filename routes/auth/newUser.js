const express = require("express");
const NewUserRoute = express.Router();

// models
const Users = require("../../models/Users");

// library
const Joi = require("@hapi/joi");

const schema = Joi.object({
  uid: Joi.string().max(120).required(),
  name: Joi.string().max(255).required(),
  email: Joi.string().max(255).required(),
});

NewUserRoute.post("/", async (req, res) => {
  const { uid, name, email } = req.body;

  // joi validation sbody data
  try {
    const validation = await schema.validateAsync({
      uid,
      name,
      email,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message, code: "bad" });
    return;
  }

  // search if uid already exist
  try {
    const singleUser = await Users.findOne({ uid: uid });
    if (singleUser) {
      return res.status(200).json({
        message: `single user already exist`,
        code: "ok",
      });
    }

    // create new user record
    const newUser = new Users({
      uid,
      name,
      email,
    });

    await newUser.save();

    return res.status(201).json({
      message: `user created successfully`,
      code: "ok",
    });
  } catch (error) {
    console.log(error, error.message);
    return res.status(500).json({
      message: `something wrong happens, retry later`,
      code: "bad",
    });
  }
});

module.exports = NewUserRoute;
