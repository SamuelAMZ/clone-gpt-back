// this file will get in input of row text and will send back an output of an array of chunck of text

// langchain
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");

const chunker = async (rawText) => {
  const text = rawText;
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 20,
  });

  try {
    const output = await splitter.createDocuments([text]);
    return output;
  } catch (error) {
    console.log(error);
  }

  return false;
};

module.exports = chunker;
