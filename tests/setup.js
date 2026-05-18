require("@dotenvx/dotenvx").config();

const mongoose = require("mongoose");

beforeAll(async () => {
  await mongoose.connect(process.env.DB_STRING_TEST);
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});
