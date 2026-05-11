const PaymentWebhookLogs = require("../models/paymentWebhookLogs");

const getRecord = async (query) => {
  try {
    const log = await PaymentWebhookLogs.findOne(query);
    return log;
  } catch (error) {
    console.error("Error fetching payment webhook log:", error);
    throw error;
  }
};

const getRecords = async (query, offset, limit, sort) => {
  try {
    const logs = await PaymentWebhookLogs.find(query)
      .sort(sort || {})
      .skip(offset || 0)
      .limit(limit || 10)
      .lean();

    const count = await PaymentWebhookLogs.countDocuments(query);

    return { logs, count };
  } catch (error) {
    console.error("Error fetching payment webhook logs:", error);
    throw error;
  }
};

module.exports = { getRecord, getRecords };
