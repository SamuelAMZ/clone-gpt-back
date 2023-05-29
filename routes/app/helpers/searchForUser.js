// this file get an input of user id and return a boolean, if user exist or not in the db

// models
const Users = require("../../../models/Users");

const isUserExist = async (uid) => {
  try {
    const singleUser = await Users.findOne({ uid: uid });
    if (!singleUser) {
      return false;
    }

    return singleUser;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = isUserExist;
