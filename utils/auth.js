const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (payload) => {
  const secretKey = process.env.JWT_SECRET || "your-secret-key";
  const options = { expiresIn: process.env.JWT_EXPIRES_IN || "30d" };

  return jwt.sign(payload, secretKey, options);
};

const hashPassword = async (password) => {
  const saltRounds = process.env.JWT_SALT_ROUNDS
    ? parseInt(process.env.JWT_SALT_ROUNDS)
    : 10;
  return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = {
  generateToken,
  hashPassword,
  comparePassword,
};
