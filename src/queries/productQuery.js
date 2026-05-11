const Product = require("../models/product");

const getRecords = async (query, offset, limit, sort) => {
  try {
    if (query.minPrice || query.maxPrice) {
      const priceFilter = {};

      if (query.minPrice) priceFilter.$gte = Number(query.minPrice);
      if (query.maxPrice) priceFilter.$lte = Number(query.maxPrice);

      query.variants = { $elemMatch: { price: priceFilter } };

      delete query.minPrice;
      delete query.maxPrice;
    }

    if (query.minAverageRating || query.maxAverageRating) {
      query.averageRating = {};
      if (query.minAverageRating)
        query.averageRating.$gte = Number(query.minAverageRating);
      if (query.maxAverageRating)
        query.averageRating.$lte = Number(query.maxAverageRating);
      delete query.minAverageRating;
      delete query.maxAverageRating;
    }

    if (query.searchString) {
      query.$or = [
        { name: { $regex: query.searchString, $options: "i" } },
        { description: { $regex: query.searchString, $options: "i" } },
      ];
      delete query.searchString;
    }

    const products = await Product.find(query)
      .sort(sort || {})
      .skip(offset)
      .limit(limit)
      .lean();

    const count = await Product.countDocuments(query);

    return { products, count };
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

const getRecord = async (query, session) => {
  try {
    const product = await Product.findOne(query).session(session || null);
    return product;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

module.exports = { getRecord, getRecords };
