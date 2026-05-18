const mongoose = require("mongoose");
const productService = require("../../../src/services/productService");
const Product = require("../../../src/models/product");
const Category = require("../../../src/models/category");
describe("consumeProducts", () => {
  let categories;
  let products;

  beforeEach(async () => {
    categories = await Category.insertMany([
      { name: "Clothing" },
      { name: "Electronics" },
    ]);

    products = await Product.insertMany([
      {
        name: "T-Shirt",
        description: "Cool T-Shirt",
        category: categories[0],
        variants: [
          {
            _id: new mongoose.Types.ObjectId(),
            color: "red",
            size: "M",
            quantity: 10,
            price: 50,
          },
          {
            _id: new mongoose.Types.ObjectId(),
            color: "blue",
            size: "L",
            quantity: 5,
            price: 50,
          },
        ],
      },
      {
        name: "Laptop",
        description: "Gaming Laptop",
        category: categories[1],
        variants: [
          {
            _id: new mongoose.Types.ObjectId(),
            color: "black",
            size: "15inch",
            quantity: 3,
            price: 1500,
          },
        ],
      },
    ]);
  });

  afterEach(async () => {
    await Product.deleteMany({});
    await Category.deleteMany({});
  });

  it("should consume stock from multiple product variants", async () => {
    const consumptionList = [
      { variant: { _id: products[0].variants[0]._id }, quantity: 2 },
      { variant: { _id: products[0].variants[1]._id }, quantity: 1 },
      { variant: { _id: products[1].variants[0]._id }, quantity: 3 },
    ];

    await productService.consumeProducts(consumptionList, null);

    const updatedTShirt = await Product.findById(products[0]._id);
    const updatedLaptop = await Product.findById(products[1]._id);

    expect(updatedTShirt?.variants[0].quantity).toBe(8);
    expect(updatedTShirt?.variants[1].quantity).toBe(4);
    expect(updatedLaptop?.variants[0].quantity).toBe(0);
  });

  it("should throw an error if not enough stock", async () => {
    const consumptionList = [
      { variant: { _id: products[0].variants[0]._id }, quantity: 11 },
    ];
    await expect(
      productService.consumeProducts(consumptionList, null),
    ).rejects.toThrow(Error);
    const updatedTShirt = await Product.findById(products[0]._id);
    expect(updatedTShirt?.variants[0].quantity).toBe(10);
  });
});
