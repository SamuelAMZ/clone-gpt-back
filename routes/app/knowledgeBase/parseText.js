// this file is responsible of fetching files from gcp storage and parsing them to raw text

// module parsers
const parseTxt = require("../modulesParsers/txt");
const parsePdf = require("../modulesParsers/pdf");

const fetchFileAndParseContent = async (fileUrl, typeOfFile) => {
  let fileContent = "";

  // parse file content
  if (typeOfFile === "copyAndPaste" || typeOfFile === "txt") {
    fileContent = await parseTxt(fileUrl);
  }
  if (typeOfFile === "pdf") {
    fileContent = await parsePdf(fileUrl);
  }
  if (typeOfFile === "externalSite") {
    fileContent = await parseTxt(fileUrl);
  }

  // return content
  return fileContent;
};

module.exports = fetchFileAndParseContent;
