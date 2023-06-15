// this file is responsible of fetching files from gcp storage and parsing them to raw text

// module parsers
const parseCopyAndPaste = require("../modulesParsers/copyAndPaste");
const parsePdf = require("../modulesParsers/pdf");

const fetchFileAndParseContent = async (fileUrl, typeOfFile) => {
  let fileContent = "";

  // parse file content
  if (typeOfFile === "copyAndPaste") {
    fileContent = await parseCopyAndPaste(fileUrl);
  }
  if (typeOfFile === "pdf") {
    fileContent = await parsePdf(fileUrl);
  }

  // return content
  return fileContent;
};

module.exports = fetchFileAndParseContent;
