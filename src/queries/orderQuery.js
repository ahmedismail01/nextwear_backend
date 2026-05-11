const Order = require("../models/order");

const getRecord = async (query, session) => {
  try {
    const order = await Order.findOne(query).session(session);
    return order;
  } catch (error) {
    throw error;
  }
};

const getRecords = async (query, offset, limit, sort) => {
  try {
    if (query.minFinalPrice || query.maxFinalPrice) {
      query.finalPrice = {};
      if (query.minFinalPrice)
        query.finalPrice.$gte = Number(query.minFinalPrice);
      if (query.maxFinalPrice)
        query.finalPrice.$lte = Number(query.maxFinalPrice);
      delete query.minFinalPrice;
      delete query.maxFinalPrice;
    }

    const orders = await Order.find(query)
      .sort(sort)
      .skip(offset)
      .limit(limit)
      .lean();
    const count = await Order.countDocuments(query);
    return { orders, count };
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

module.exports = { getRecord, getRecords };
