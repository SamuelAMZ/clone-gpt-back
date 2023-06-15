// this file will help with uploading files to gcp bucket
const { Storage } = require("@google-cloud/storage");
const url = require("url");

const uploadFileToBucket = (file, res) => {
  // Create a GCS client
  const storage = new Storage();
  const bucketName = "contexts_storage";
  const bucket = storage.bucket(bucketName);
  const gcsFileName = `${Date.now()}-${file.originalname}`;
  const gcsFile = bucket.file(gcsFileName);

  const stream = gcsFile.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
    resumable: false,
  });

  stream.on("error", (err) => {
    console.log(err);
    file.buffer = null;
    res.status(500).json("stream error when uploading file");
  });

  stream.on("finish", () => {
    file.buffer = null;

    // Get the file URL
    const fileUrl = `https://storage.googleapis.com/${bucketName}/${gcsFileName}`;

    const parsedUrl = url.parse(fileUrl);
    const transformedUrl = `${parsedUrl.protocol}//${parsedUrl.host}${parsedUrl.pathname}`;

    res.status(201).json({ url: transformedUrl, name: gcsFileName });
  });

  stream.end(file.buffer);
};

module.exports = uploadFileToBucket;
