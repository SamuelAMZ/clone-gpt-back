// this file take as input a vector (query) and search for the right data from pinecone return a array of resutls

const queryPinecone = async (queryVector, uid, contextId) => {
  try {
    let headers = new Headers();
    headers.append("Api-Key", process.env.PINECONE_KEY);
    headers.append("Content-Type", "application/json");

    const bodyData = {
      vector: queryVector,
      filter: {
        contextId: {
          $eq: contextId,
        },
        uid: {
          $eq: uid,
        },
      },
      namespace: uid,
      topK: 3,
      includeMetadata: true,
    };

    let requestOptions = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(bodyData),
      redirect: "follow",
    };

    let res = await fetch(
      `${process.env.PINECONE_ENDPOINT}/query`,
      requestOptions
    );
    let data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }

  return false;
};

module.exports = queryPinecone;
