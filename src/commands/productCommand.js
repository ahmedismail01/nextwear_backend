const Product = require("../models/product");

const createRecord = async (data) => {
  try {
    const rec = new Product(data);
    await rec.save();
    return rec;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};
const AppError = require("../utils/appError");

const updateRecord = async (query, updateData) => {
  try {
    const rec = await Product.findOneAndUpdate(query, updateData, {
      new: true,
    });

    if (!rec) {
      throw new AppError("Product not found", 404, true);
    }

    return rec;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

const deleteRecord = async (query) => {
  try {
    const result = await Product.findOneAndDelete(query);

    if (!result) {
      throw new AppError("Product not found", 404, true);
    }

    return result;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

const updateRecords = async (query, updateData) => {
  try {
    const rec = await Product.updateMany(query, updateData, { new: true });
    return rec;
  } catch (error) {
    console.error("Error updating products:", error);
    throw error;
  }
};

const addVariant = async (productId, data) => {
  try {
    const rec = await Product.findOneAndUpdate(
      { _id: productId },
      { $push: { variants: data } },
      { new: true },
    );

    if (!rec) {
      throw new AppError("Product not found", 404, true);
    }

    return rec;
  } catch (error) {
    console.error("Error adding variant:", error);
    throw error;
  }
};

const removeVariant = async (productId, variantId) => {
  try {
    const rec = await Product.findOneAndUpdate(
      { _id: productId },
      { $pull: { variants: { _id: variantId } } },
      { new: true },
    );

    if (!rec) {
      throw new AppError("Product not found", 404, true);
    }

    return rec;
  } catch (error) {
    console.error("Error removing variant:", error);
    throw error;
  }
};

const updateVariant = async (variantId, data, session) => {
  try {
    const oldData = await Product.findOne({
      "variants._id": variantId,
    });

    if (!oldData) {
      throw new AppError("Product not found", 404, true);
    }

    const variant = oldData.variants.id(variantId)?.toObject();

    if (!variant) {
      throw new AppError("Variant not found", 404, true);
    }

    if (data?.images) data.images = [...variant.images, ...data.images];

    data = { ...variant, ...data };

    const rec = await Product.findOneAndUpdate(
      { "variants._id": variantId },
      { $set: { "variants.$": data } },
      { new: true },
    ).session(session || null);
    return rec;
  } catch (error) {
    console.error("Error updating variant:", error);
    throw error;
  }
};

const consumeProducts = async (products, session = null) => {
  const variantsIds = products.map(({ variant }) => variant._id);

  const foundProducts = await Product.find({
    "variants._id": { $in: variantsIds },
  }).session(session);

  const variantsMap = new Map();
  for (const product of foundProducts) {
    for (const v of product.variants) {
      variantsMap.set(String(v._id), v);
    }
  }

  // Validate
  for (const { variant, quantity } of products) {
    const realVariant = variantsMap.get(String(variant._id));
    if (!realVariant) throw new AppError("Variant not found", 404, true);
    if (realVariant.quantity < quantity) {
      throw new AppError("Not enough quantity", 400, true);
    }
  }

  // Consume
  await Promise.all(
    products.map(async ({ variant, quantity }) => {
      const realVariant = variantsMap.get(String(variant._id));
      await Product.updateOne(
        { "variants._id": variant._id },
        {
          $inc: { "variants.$.quantity": -quantity },
        },
      ).session(session);
    }),
  );
};

module.exports = {
  createRecord,
  updateRecord,
  deleteRecord,
  updateRecords,
  addVariant,
  removeVariant,
  updateVariant,
  consumeProducts,
};
