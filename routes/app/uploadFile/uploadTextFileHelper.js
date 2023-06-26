// will help with uploading text files

// gcp storage
const { Storage } = require("@google-cloud/storage");

// node apis
const url = require("url");

const createAndUploadTextFile = async (fileContent) => {
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

  return { url: transformedUrl, name: uploadedFileName };
};

module.exports = createAndUploadTextFile;
