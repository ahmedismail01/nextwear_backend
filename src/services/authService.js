const jwt = require("jsonwebtoken");
const userQuery = require("../queries/userQuery");
const userCommand = require("../commands/userCommand");
const bcrypt = require("bcryptjs");
const AppError = require("../utils/appError");
const { sanitizeUser } = require("../dto/userDto");
class authService {
  async login(email, password) {
    const user = await userQuery.getRecord({ email });
    if (!user) {
      throw new AppError("Invalid credentials", 401, true);
    }
    const isMatch = await this.comparePassword(password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid credentials", 401, true);
    }

    return sanitizeUser(user);
  }

  async generateToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
  }
  async register(userData) {
    const existingUser = await userQuery.getRecord({ email: userData.email });
    if (existingUser) {
      throw new AppError("User already exists", 409, true);
    }
    const newUser = await userCommand.createRecord(userData);
    return sanitizeUser(newUser);
  }

  async comparePassword(inputPassword, storedPassword) {
    return bcrypt.compareSync(inputPassword, storedPassword);
  }

  async hashPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (error) {
      throw new AppError("Invalid token", 401, true);
    }
  }
}
module.exports = new authService();
