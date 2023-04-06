const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const timeout = require("connect-timeout");

// app routes
const NewShareRoute = require("./routes/app/newShare");
const SingleShareRoute = require("./routes/app/singleShare");
const userchatsRoute = require("./routes/app/userChats");

// auth routes
const NewUserRoute = require("./routes/auth/newUser");

// timeout
app.use(timeout(600000));
// body parsing
app.use(express.json({ limit: "50mb" }));
// cookies
app.use(cookieParser());

// cors
let alloweds = {
  origin: [process.env.DOMAIN, process.env.PUBLINK],
};
app.use(
  cors({
    origin: alloweds.origin,
    credentials: true,
    optionSuccessStatus: 200,
  })
);

// set headers globally
app.use((req, res, next) => {
  const origin =
    alloweds.origin.includes(req.header("origin").toLowerCase()) &&
    req.headers.origin;
  res.header("Access-Control-Allow-Origin", origin);
  res.set({
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Origin, Content-Type, Accept",
  });
  next();
});

// connect mongoose
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DB_URI, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected to db");
  }
});

app.get("/", (req, res) => {
  res.status(200).send("Server up");
});

/*   
    @desc: new share
    @method: POST
    @privacy: public
    @endpoint: /api/new-share
*/
app.use("/api/new-share", NewShareRoute);

/*   
    @desc: single share
    @method: POST
    @privacy: public
    @endpoint: /api/single-share
*/
app.use("/api/single-share", SingleShareRoute);

/*   
    @desc: single share
    @method: POST
    @privacy: public
    @endpoint: /api/single-share
*/
app.use("/api/new-user", NewUserRoute);

/*   
    @desc: single user chats
    @method: POST
    @privacy: public
    @endpoint: /api/user-chats
*/
app.use("/api/user-chats", userchatsRoute);

app.listen(process.env.PORT, () =>
  console.log(`app listen on port ${process.env.PORT}`)
);
