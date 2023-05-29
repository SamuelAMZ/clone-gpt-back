// this file will receive as an input, an array of texts and will return an array of embeddings of the texts

// langchain
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");

// dotenv
require("dotenv").config();

const contextEmbeddings = async (chunksArray) => {
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_KEY,
    maxConcurrency: 25,
    maxRetries: 4,
  });

  try {
    const documentRes = await embeddings.embedDocuments(chunksArray);
    return documentRes;
  } catch (error) {
    console.log(error, error.message);
  }

  return false;
};

module.exports = contextEmbeddings;
