const Review = require("../models/reviews");

const getRecord = async (query) => {
  try {
    const review = await Review.findOne(query);
    return review;
  } catch (error) {
    console.error("Error fetching review:", error);
    throw error;
  }
};

const getRecords = async (query, skip, limit, sort) => {
  try {
    const reviews = await Review.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
    const count = await Review.countDocuments(query);
    return { reviews, count };
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

module.exports = { getRecord, getRecords };
