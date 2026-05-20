const authService = require("../services/authService");
const { sanitizeUser } = require("../dto/userDto");

const login = async (req, res) => {
  const body = req.body;

  // authenticate user using auth service
  const user = await authService.login(body.email, body.password);

  // generate token
  const payload = { id: user._id, email: user.email, role: user.role };
  const token = await authService.generateToken(payload);

  res.cookie("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  // sanitize user object before sending response
  const sanitizedUser = sanitizeUser(user);

  res.json({ success: true, user: sanitizedUser, token });
};

const register = async (req, res) => {
  const body = req.body;

  const user = await authService.register(body);

  // generate token
  const payload = { id: user._id, email: user.email, role: user.role };
  const token = await authService.generateToken(payload);

  res.cookie("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  // sanitize user object before sending response
  const sanitizedUser = sanitizeUser(user);

  res.json({
    success: true,
    message: `Welcome to NextWear, ${sanitizedUser.firstName}! Your account has been created successfully.`,
    user: sanitizedUser,
    token,
  });
};

module.exports = { login, register };
