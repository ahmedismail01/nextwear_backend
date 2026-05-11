const PromoCode = require("../models/promoCode");

const getRecord = async (query) => {
  try {
    const promocode = await PromoCode.findOne(query);
    return promocode;
  } catch (error) {
    console.error("Error fetching promocode:", error);
    throw error;
  }
};

const getRecords = async (query, skip, limit, sort) => {
  try {
    const promocodes = await PromoCode.find(query)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .lean();
    const count = await PromoCode.countDocuments(query);
    return { promocodes, count };
  } catch (error) {
    console.error("Error fetching promocodes:", error);
    throw error;
  }
};

module.exports = { getRecord, getRecords };
