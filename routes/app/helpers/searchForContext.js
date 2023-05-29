// this file get an input of context id and return a boolean, if context exist or not in the db

// models
const Contexts = require("../../../models/Contexts");

const isContextExist = async (contextId) => {
  try {
    const singleContext = await Contexts.findOne({ _id: contextId });
    if (!singleContext) {
      return false;
    }

    return singleContext;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = isContextExist;
