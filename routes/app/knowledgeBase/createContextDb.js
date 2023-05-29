// create a record of the context

// models
const Contexts = require("../../../models/Contexts");

const newContext = async (contextData) => {
  const aNewContext = new Contexts(contextData);

  try {
    const res = await aNewContext.save();
    return res._id;
  } catch (error) {
    console.log(error, error.message);
  }

  return false;
};

module.exports = newContext;
