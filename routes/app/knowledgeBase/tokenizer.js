// this file check the size of the file and abord or not the request if exeed the linit
const tokenizer = (text, type) => {
  const tokens = text.split(/\s+/); // Splitting the text by whitespace
  const length = tokens.length;

  if (type === "upserting" && length > 500000) {
    return false;
  }
  if (type === "querying" && length > 1000) {
    return false;
  }

  return length;
};

module.exports = tokenizer;
