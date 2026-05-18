const { getRecord, getRecords } = require("../queries/userQuery");
const { updateRecord, deleteRecord } = require("../commands/userCommand");
const { sanitizeUser, sanitizeUsers } = require("../dto/userDto");
const userService = require("../services/userService");

const getAllUsers = async (req, res) => {
  const users = await getRecords({});
  const sanitizedUsers = sanitizeUsers(users) || [];
  res.status(200).json({ success: true, data: sanitizedUsers });
};

const getUser = async (req, res) => {
  const userId = req.params.id;
  const user = await getRecord({ _id: userId });
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  res.status(200).json({ success: true, data: user });
};

const getCurrentUser = async (req, res) => {
  const userId = req.user.id;
  const user = await getRecord({ _id: userId });
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  const sanitizedUser = sanitizeUser(user);
  res.status(200).json({ success: true, data: sanitizedUser });
};

const deleteUser = async (req, res) => {
  const userId = req.user.id;
  const user = await getRecord({ _id: userId });
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  await deleteRecord({ _id: userId });
  res.status(200).json({ success: true, message: "User deleted successfully" });
};

const getProfile = async (req, res) => {
  const userId = req.user.id;
  const user = await getRecord({ _id: userId });
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  const sanitizedUser = sanitizeUser(user);
  res.status(200).json({ success: true, data: sanitizedUser });
};

const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const updates = req.body;

  const updatedUser = await userService.updateUser(userId, updates);

  const sanitizedUser = sanitizeUser(updatedUser);

  res.status(200).json({ success: true, data: sanitizedUser });
};

const addAddress = async (req, res) => {
  const userId = req.user.id;
  const address = req.body;
  const updatedUser = await userService.addAddress(userId, address);
  const sanitizedUser = sanitizeUser(updatedUser);
  res.status(200).json({ success: true, data: sanitizedUser });
};

const removeAddress = async (req, res) => {
  const userId = req.user.id;
  const addressId = req.params.addressId;
  const updatedUser = await userService.removeAddress(userId, addressId);
  const sanitizedUser = sanitizeUser(updatedUser);
  res.status(200).json({ success: true, data: sanitizedUser });
};

const updateAddress = async (req, res) => {
  const userId = req.user.id;
  const addressId = req.params.addressId;
  const address = req.body;
  const updatedUser = await userService.updateAddress(
    userId,
    addressId,
    address,
  );
  const sanitizedUser = sanitizeUser(updatedUser);
  res.status(200).json({ success: true, data: sanitizedUser });
};

module.exports = {
  getAllUsers,
  getUser,
  getCurrentUser,
  deleteUser,
  getProfile,
  updateProfile,
  addAddress,
  removeAddress,
  updateAddress,
};
