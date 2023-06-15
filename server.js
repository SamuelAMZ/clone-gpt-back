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

// knowledgeBase route
const addToStoreRoute = require("./routes/app/knowledgeBase/_addToStore");
const queryStoreRoute = require("./routes/app/knowledgeBase/_queryStore");
const singleContextRoute = require("./routes/app/knowledgeBase/_singleContext");
const contextsListRoute = require("./routes/app/knowledgeBase/_contextList");
const activateContextRoute = require("./routes/app/knowledgeBase/_activateContext");
const pauseContextRoute = require("./routes/app/knowledgeBase/_pauseContext");
const activeContextsListRoute = require("./routes/app/knowledgeBase/_activeContextsList");

// upload routes
const uploadFileRoute = require("./routes/app/uploadFile/uploadFile");
const createAndUploadText = require("./routes/app/uploadFile/createTextFileAndUpload");

// auth routes
const NewUserRoute = require("./routes/auth/newUser");

// timeout
app.use(timeout(600000));

// cors
let alloweds = {
  origin: [process.env.DOMAIN, process.env.PUBLINK, process.env.PUBLINKLIVE],
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
    alloweds?.origin?.includes(req.header("origin")?.toLowerCase()) &&
    req.headers.origin;
  res.header("Access-Control-Allow-Origin", origin);
  res.set({
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Origin, Content-Type, Accept",
  });
  next();
});

/*   
    @desc: upload files
    @method: POST
    @privacy: public
*/
app.use("/api/upload-file", uploadFileRoute);

// body parsing
app.use(express.json({ limit: "50mb" }));
// cookies
app.use(cookieParser());

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
*/
app.use("/api/new-share", NewShareRoute);

/*   
    @desc: single share
    @method: POST
    @privacy: public
*/
app.use("/api/single-share", SingleShareRoute);

/*   
    @desc: single share
    @method: POST
    @privacy: public
*/
app.use("/api/new-user", NewUserRoute);

/*   
    @desc: single user chats
    @method: POST
    @privacy: public
*/
app.use("/api/user-chats", userchatsRoute);

/*   
    @desc: chunck, embedds, store context
    @method: POST
    @privacy: public
*/
app.use("/api/new-context", addToStoreRoute);

/*   
    @desc: query the context
    @method: POST
    @privacy: public
*/
app.use("/api/new-query", queryStoreRoute);

/*   
    @desc: return single context base on Id
    @method: POST
    @privacy: public
*/
app.use("/api/single-context", singleContextRoute);

/*   
    @desc: return list of contexts based on uid
    @method: POST
    @privacy: public
*/
app.use("/api/contexts-list", contextsListRoute);

/*   
    @desc: activate context by on contextId
    @method: POST
    @privacy: public
*/
app.use("/api/activate-context", activateContextRoute);

/*   
    @desc: pause context by on contextId
    @method: POST
    @privacy: public
*/
app.use("/api/pause-context", pauseContextRoute);

/*   
    @desc: list active context by uid
    @method: POST
    @privacy: public
*/
app.use("/api/active-contexts", activeContextsListRoute);

/*   
    @desc: create and upload text file
    @method: POST
    @privacy: public
*/
app.use("/api/create-file-then-upload", createAndUploadText);

app.listen(process.env.PORT, () =>
  console.log(`app listen on port ${process.env.PORT}`)
);
