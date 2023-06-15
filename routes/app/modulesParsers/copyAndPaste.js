const parseCopyAndPaste = async (url) => {
  let response = await fetch(url);
  let text = await response.text();

  return text;
};

module.exports = parseCopyAndPaste;
