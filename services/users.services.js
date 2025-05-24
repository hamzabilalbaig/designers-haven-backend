const bcrypt = require("bcryptjs");
const db = require("../models");
const jwt = require("jsonwebtoken");

const userDb = db.Users;

const generateToken = (payload) => {
  const secretKey = process.env.JWT_SECRET || "your-secret-key";
  const options = { expiresIn: process.env.JWT_EXPIRES_IN || "30d" };

  return jwt.sign(payload, secretKey, options);
};

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

exports.createUser = async (userData) => {
  if (!userData.email || !userData.password || !userData.firstName) {
    const error = new Error("Content cannot be empty!");
    error.status = 400;
    throw error;
  }

  const emailExists = await userDb.findOne({
    where: { email: userData.email },
  });

  if (emailExists) {
    const error = new Error("Email already in use!");
    error.status = 400;
    throw error;
  }

  const hashedPassword = await hashPassword(userData.password);
  userData.password = hashedPassword;

  const user = await userDb.create(userData);
  delete user.dataValues.password;

  const token = generateToken({ id: user.id });

  return { user, token, message: "User created successfully!" };
};

exports.login = async (email, password) => {
  if (!email || !password) {
    const error = new Error("Content cannot be empty!");
    error.status = 400;
    throw error;
  }

  const user = await userDb.findOne({
    where: { email },
  });

  if (!user) {
    const error = new Error("User not found.");
    error.status = 400;
    throw error;
  }

  const passwordIsValid = bcrypt.compare(password, user.password);
  if (!passwordIsValid) {
    const error = new Error("Invalid Password!");
    error.status = 400;
    throw error;
  }

  const token = generateToken({ id: user.id });
  delete user.dataValues.password;

  return { user, token };
};

exports.getAllUsers = async () => {
  const users = await userDb.findAll({
    attributes: { exclude: ["password"] },
  });

  if (!users) {
    const error = new Error("No users found.");
    error.status = 404;
    throw error;
  }

  return users;
};

exports.updateUser = async (userId, userData) => {
  if (!userId || !userData) {
    const error = new Error("User ID and data cannot be empty!");
    error.status = 400;
    throw error;
  }

  const user = await userDb.findByPk(userId);
  if (!user) {
    const error = new Error("User not found.");
    error.status = 404;
    throw error;
  }

  if (userData.password) {
    userData.password = await hashPassword(userData.password);
  }

  await user.update(userData);
  delete user.dataValues.password;

  return { user, message: "User updated successfully!" };
};
exports.deleteUser = async (userId) => {
  if (!userId) {
    const error = new Error("User ID cannot be empty!");
    error.status = 400;
    throw error;
  }

  const user = await userDb.findByPk(userId);
  if (!user) {
    const error = new Error("User not found.");
    error.status = 404;
    throw error;
  }

  await user.destroy();

  return { message: "User deleted successfully!" };
};

exports.getUserById = async (userId) => {
  if (!userId) {
    const error = new Error("User ID cannot be empty!");
    error.status = 400;
    throw error;
  }

  const user = await userDb.findByPk(userId, {
    attributes: { exclude: ["password"] },
  });

  if (!user) {
    const error = new Error("User not found.");
    error.status = 404;
    throw error;
  }

  return user;
};

exports.getUserByEmail = async (email) => {
  if (!email) {
    const error = new Error("Email cannot be empty!");
    error.status = 400;
    throw error;
  }

  const user = await userDb.findOne({
    where: { email },
    attributes: { exclude: ["password"] },
  });

  if (!user) {
    const error = new Error("User not found.");
    error.status = 404;
    throw error;
  }

  return user;
};
