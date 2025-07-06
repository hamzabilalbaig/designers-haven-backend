const db = require("../models");
const jwt = require("jsonwebtoken");

exports.isAuthenticated = async (req, res, next) => {
  try {
    let token = "";

    const authorizationHeader = req.header("Authorization");

    if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
      token = authorizationHeader.slice(7);
    } else {
      console.error(
        "Authorization header is missing or does not contain a Bearer token"
      );
    }

    if (!token) {
      return res.status(401).json({
        message: "Please login first",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await db.Users.findOne({
      where: {
        id: decoded.id,
      },
    });

    if (!req.user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired. Please login again",
      });
    }

    res.status(500).json({
      message: error.message,
    });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    console.log(req.user.role, "role");
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admins only.",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
