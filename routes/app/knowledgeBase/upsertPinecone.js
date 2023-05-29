// this file add new vectors to pinecone

// dotenv
require("dotenv").config();

const addToPinecone = async (
  vectorsArray,
  chunkSourceInfo,
  metadata,
  chunksArray
) => {
  // generate random id for the vectors
  function generateRandomID() {
    const timestamp = Date.now().toString();
    const randomParam1 = Math.random().toString().substr(2, 5);
    const randomParam2 = Math.random().toString().substr(2, 5);

    const randomID = `${timestamp}_${randomParam1}_${randomParam2}`;
    return randomID;
  }

  // transform the source in array of strings
  function getObjectStrings(obj, prefix = "") {
    const result = [];

    for (const key in obj) {
      const value = obj[key];
      const currentKey = prefix ? `${prefix}.${key}` : key;

      if (typeof value === "object" && value !== null) {
        result.push(currentKey);
        const nestedStrings = getObjectStrings(value, currentKey);
        result.push(...nestedStrings);
      } else {
        const valueString =
          typeof value === "string" ? `"${value}"` : value.toString();
        result.push(`${currentKey}: ${valueString}`);
      }
    }

    return result;
  }

  try {
    const vectors = [];

    for (let i = 0; i < vectorsArray.length; i++) {
      const id = generateRandomID();

      vectors.push({
        id,
        values: vectorsArray[i],
        metadata: {
          uid: metadata.uid,
          contextId: metadata.contextId,
          module: metadata.module,
          source: getObjectStrings(chunkSourceInfo[i]),
          chunk: chunksArray[i],
        },
      });
    }

    let headers = new Headers();
    headers.append("Api-Key", process.env.PINECONE_KEY);
    headers.append("Content-Type", "application/json");

    let requestOptions = {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ vectors: vectors, namespace: metadata.uid }),
      redirect: "follow",
    };

    let res = await fetch(
      `${process.env.PINECONE_ENDPOINT}/vectors/upsert`,
      requestOptions
    );
    let data = await res.json();
    return data;
  } catch (error) {
    console.log(error, error.message);
  }
  return false;
};

module.exports = addToPinecone;
