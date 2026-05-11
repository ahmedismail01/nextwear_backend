const User = require("../models/user");

const getRecord = async (query) => {
  try {
    const user = await User.findOne(query);
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

const getRecords = async (query) => {
  try {
    const users = await User.find(query).lean();
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

module.exports = { getRecord, getRecords };
