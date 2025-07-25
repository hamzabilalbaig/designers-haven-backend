const db = require("../models");
const { fn, col } = require("sequelize");

const {
  generateToken,
  hashPassword,
  comparePassword,
} = require("../utils/auth");

const userDb = db.Users;

exports.createUser = async (userData) => {
  if (!userData.email || !userData.password || !userData.fullName) {
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

  const passwordIsValid = await comparePassword(password, user.password);
  if (!passwordIsValid) {
    const error = new Error("Invalid Password!");
    error.status = 400;
    throw error;
  }

  const token = generateToken({ id: user.id });
  delete user.dataValues.password;

  return { user, token };
};

exports.getAllDesigners = async (status) => {
  const designerWhere = {};

  if (status) {
    designerWhere.status = status;
  }
  const users = await userDb.findAll({
    where: { role: "designer", ...designerWhere },
    attributes: {
      exclude: ["password"],
      include: [[fn("COUNT", col("products.id")), "productCount"]],
    },
    include: [
      {
        model: db.Products,
        as: "products",
        attributes: [],
        required: false,
      },
    ],
    group: ["Users.id"],
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
