const Category = require("../models/category");

const getRecords = async (query) => {
  try {
    const categories = await Category.find(query).lean();
    const count = await Category.countDocuments(query);
    return { categories, count };
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

const getRecord = async (query) => {
  try {
    const product = await Category.findOne(query);
    return product;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

module.exports = { getRecord, getRecords };
