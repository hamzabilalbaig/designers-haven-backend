const db = require("../models");
const userService = require("../services/users.services");
const {
  generateToken,
  hashPassword,
  comparePassword,
} = require("../utils/auth");
const sendEmail = require("../utils/sendEmail");

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

    userData.email = userData.email.toLowerCase();
    userData.role = userData.role.toLowerCase();

    const emailExists = await userDb.findOne({
      where: { email: userData.email },
    });

    if (emailExists) {
      res.status(400).json({ error: "Email already exists!" });
      return;
    }

    const hashedPassword = await hashPassword(userData.password);
    userData.password = hashedPassword;

    const user = await userDb.create(userData);
    delete user.dataValues.password;

    const token = generateToken({ id: user.id });

    await sendEmail({
      to: user.email,
      subject: "Welcome to Designers Haven!",
      html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
      <h2 style="color: #2E3A59;">Welcome to Designer’s Haven, ${user.fullName}!</h2>
      
      <p>Thank you for registering with <strong>Designer’s Haven</strong>. Your account has been created successfully, and we’re excited to have you on board.</p>

      <p><strong>Your User ID:</strong> ${user.id}</p>

      <p>Please note that your account status is currently <strong>Pending</strong> and is awaiting admin approval. Once approved, you will be able to list your products on the platform.</p>

      <p>Until your account is approved, certain features such as product listing will remain unavailable.</p>

      <p>You can still log in using your email and password to explore the platform and set up your profile.</p>

      <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>

      <p>Best regards,<br />
      <strong>The Designers Haven Team</strong></p>
    </div>
  `,
    });

    await sendEmail({
      to: "designershavenzw@gmail.com",
      subject: "New Designer Signup – Approval Pending",
      html: `
      <p>Dear Admin,</p>

      <p>We would like to inform you that a new designer has just signed up on the platform. Their account status is currently marked as <strong>Pending Approval</strong>.</p>

      <p><strong>Designer Details:</strong><br />
      - <strong>Name:</strong> ${user.fullName}<br />
      - <strong>Email:</strong> ${user.email}<br />
      - <strong>Signup Date:</strong> ${user.createdAt}</p>

      <p>Please review their profile and take the necessary action to approve or reject the request as appropriate.</p>

      <p>Best regards,<br />
      Designer’s Haven Team</p>
    `,
    });

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
  const status = req.query.status || null;
  try {
    const users = await userService.getAllDesigners(status);

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

exports.getDesignerById = async (req, res) => {
  try {
    const designerId = req.query.designerId;

    if (!designerId) {
      return res.status(400).json({ error: "Designer ID is required!" });
    }

    const designer = await userDb.findByPk(designerId, {
      attributes: {
        exclude: [
          "password",
          "createdAt",
          "updatedAt",
          "birthdate",
          "role",
          "phone",
        ],
      },
      include: [
        {
          model: db.Products,
          as: "products",
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
        },
      ],
    });

    if (!designer) {
      return res.status(404).json({ error: "Designer not found!" });
    }

    res.status(200).json(designer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const userData = req.body;

    const user = await userDb.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    if (userData.status && userData.status !== user.status) {
      if (userData.status === "active") {
        await sendEmail({
          to: user.email,
          subject: "Your Designer Account is Approved!",
          html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
            <h2 style="color: #2E3A59;">Congratulations, ${user.fullName}!</h2>
            <p>Your designer account has been approved. You can now start listing your products on Designer’s Haven.</p>
            <p>Thank you for being a part of our community!</p>
            <p>Best regards,<br />
            The Designers Haven Team</p>
          </div>
        `,
        });
      } else if (userData.status === "inactive") {
        await sendEmail({
          to: user.email,
          subject: "Your Designer Account Application is Rejected",
          html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
            <h2 style="color: #2E3A59;">Hello ${user.fullName},</h2>
            <p>We regret to inform you that your designer account application has been rejected. If you have any questions or need further clarification, please feel free to reach out to us.</p>
            <p>Thank you for your understanding.</p>
            <p>Best regards,<br />
            The Designers Haven Team</p>
          </div>
        `,
        });
      }
    }

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

exports.updatePassword = async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;

    if (!userId || !oldPassword || !newPassword) {
      return res.status(400).json({ error: "Required fields are missing!" });
    }

    const user = await userDb.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    const isMatch = await comparePassword(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Old password is incorrect!" });
    }

    const hashedNewPassword = await hashPassword(newPassword);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully!" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "Server Error" });
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

exports.getDesignerMetrics = async (req, res) => {
  const designerId = req.query.designerId;

  try {
    const user = await userDb.findByPk(designerId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const productStatuses = await productsDb.findAll({
      where: { brandId: designerId },
      attributes: ["status"],
      raw: true,
    });

    const statusCount = {
      active: 0,
      pending: 0,
      rejected: 0,
    };

    productStatuses.forEach((p) => {
      const status = p.status?.toLowerCase();
      if (statusCount.hasOwnProperty(status)) {
        statusCount[status]++;
      }
    });

    const lastProduct = await productsDb.findOne({
      where: { brandId: designerId },
      order: [["createdAt", "DESC"]],
    });

    const lastProductStatus = lastProduct?.status || "N/A";
    const lastProductTitle = lastProduct?.name || "N/A";

    res.json({
      ...statusCount,
      lastProductStatus,
      lastProductTitle,
      accountStatus: user.status,
    });
  } catch (error) {
    console.error("Error fetching designer metrics:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
