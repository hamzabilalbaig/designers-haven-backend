const db = require("../models");
const userService = require("../services/users.services");
const {
  generateToken,
  hashPassword,
  comparePassword,
} = require("../utils/auth");

const { Op } = require("sequelize");

const userDb = db.Users;
const productsDb = db.Products;

exports.createUser = async (req, res) => {
  const userData = req.body;
  try {
    if (
      !userData.email ||
      !userData.password ||
      !userData.fullName ||
      !userData.role
    ) {
      res.status(400).json({ error: "Required fields are missing!" });
      return;
    }

    const emailExists = await userDb.findOne({
      where: { email: userData.email },
    });

    if (emailExists) {
      res.status(400).json({ error: "Email already exists!" });
      return;
    }

    const hashedPassword = await hashPassword(userData.password);
    userData.password = hashedPassword;

    if (userData.location?.lat && userData.location?.lng) {
      const { lat, lng } = userData.location;

      userData.location = {
        type: "Point",
        coordinates: [lng, lat],
      };
    }

    const user = await userDb.create(userData);
    delete user.dataValues.password;

    const token = generateToken({ id: user.id });

    return res
      .status(200)
      .json({ user: user.id, token, message: "User created successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { user, token } = await userService.login(email, password);

    res.status(200).send({
      message: "Login successful!",
      user,
      accessToken: token,
    });
  } catch (error) {
    res.status(error.status || 500).send({
      message: error.message || "An error occurred while logging in.",
    });
  }
};

exports.getAllDesigners = async (req, res) => {
  try {
    const users = await userService.getAllDesigners();

    res.status(200).send(users);
  } catch (error) {
    res.status(error.status || 500).send({
      message: error.message || "An error occurred while retrieving users.",
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.query.userId || req.user.id;

    const user = await userService.getUserById(userId);

    res.status(200).send(user);
  } catch (error) {
    res.status(error.status || 500).send({
      message: error.message || "An error occurred while retrieving the user.",
    });
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const userData = req.body;

    const updatedUser = await userService.updateUser(userId, userData);

    res.status(200).send({
      message: "User was updated successfully!",
      user: updatedUser,
    });
  } catch (error) {
    res.status(error.status || 500).send({
      message: error.message || "An error occurred while updating the user.",
    });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.query.userId;

    await userService.deleteUser(userId);

    res.status(200).send({
      message: "User was deleted successfully!",
    });
  } catch (error) {
    res.status(error.status || 500).send({
      message: error.message || "An error occurred while deleting the user.",
    });
  }
};

exports.getDashboardMetrics = async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [
      newProductSubmissions,
      totalDesigners,
      totalProducts,
      pendingDesignerApprovals,
      newDesignersThisMonth,
      newProductsThisMonth,
    ] = await Promise.all([
      productsDb.count({ where: { status: "pending" } }),

      userDb.count({ where: { role: "designer" } }),

      productsDb.count(),

      userDb.count({
        where: {
          role: "designer",
          status: "pending",
        },
      }),

      userDb.count({
        where: {
          role: "designer",
          createdAt: {
            [Op.gte]: startOfMonth,
          },
        },
      }),

      productsDb.count({
        where: {
          createdAt: {
            [Op.gte]: startOfMonth,
          },
        },
      }),
    ]);

    res.json({
      newProductSubmissions,
      totalDesigners,
      totalProducts,
      pendingDesignerApprovals,
      newDesignersThisMonth,
      newProductsThisMonth,
    });
  } catch (err) {
    console.error("Error fetching dashboard metrics:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
