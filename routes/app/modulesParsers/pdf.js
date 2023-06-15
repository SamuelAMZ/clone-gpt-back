// this file will get the pdf file raw text

const PDFParser = require("pdf-parse");

const parsePdf = async (url) => {
  try {
    let response = await fetch(url);
    let buffer = await response.arrayBuffer();

    const pdfData = new Uint8Array(buffer);
    let data = await PDFParser(pdfData);
    return data.text;
  } catch (error) {
    console.log(error);
    throw new Error("error fetching pdf");
  }
};

module.exports = parsePdf;
