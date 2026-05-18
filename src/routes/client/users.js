const app = require("express").Router();
const authenticate = require("../../middlewares/authenticate");
const asyncHandler = require("../../middlewares/asyncHandler");
const userController = require("../../controllers/userController");
const validator = require("../../middlewares/validator");
const schema = require("../../validations/userValidation");

// Profile
app.get("/", authenticate(), asyncHandler(userController.getProfile));

app.put(
  "/",
  [authenticate(), validator(schema.updateProfile)],
  asyncHandler(userController.updateProfile),
);

app.post(
  "/address",
  [authenticate(), validator(schema.addAddress)],
  asyncHandler(userController.addAddress),
);

app.put(
  "/address/:addressId",
  [authenticate(), validator(schema.updateAddress)],
  asyncHandler(userController.updateAddress),
);

app.delete(
  "/address/:addressId",
  [authenticate(), validator(schema.removeAddress)],
  asyncHandler(userController.removeAddress),
);

module.exports = app;
