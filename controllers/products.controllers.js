const { Op } = require("sequelize");

const db = require("../models");

const productsDb = db.Products;
const Users = db.Users;

exports.createProduct = async (req, res) => {
  const productData = req.body;
  const userId = req.user.id;
  try {
    if (!productData.name || !productData.price || !productData.brandId) {
      res.status(400).json({ error: "Required fields are missing!" });
      return;
    }

    const user = await Users.findByPk(userId);

    if (user.role === "designer" && user.status !== "active") {
      return res.status(400).json({
        error: "Your account is not active. You cannot create products.",
      });
    }

    const product = await productsDb.create(productData);
    return res
      .status(201)
      .json({ product, message: "Product created successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  const status = req.query.status || null;

  const productWhere = {};
  const storeWhere = {};

  if (status) {
    productWhere.status = status;
    storeWhere.status = status;
  }

  try {
    const products = await productsDb.findAll({
      where: productWhere,
      include: [
        {
          model: db.Users,
          as: "store",
          where: storeWhere,
          attributes: ["id", "fullName", "email", "avatar", "whatsApp"],
          required: true,
        },
      ],
    });
    return res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  const productId = req.query.productId;
  try {
    const product = await productsDb.findByPk(productId, {
      include: [
        {
          model: db.Users,
          as: "store",
          attributes: ["id", "fullName", "email", "avatar", "whatsApp"],
        },
      ],
    });
    if (!product) {
      return res.status(400).json({ error: "Product not found!" });
    }
    return res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  const productId = req.body.productId;
  const productData = req.body;
  const userId = req.user.id;

  try {
    const product = await productsDb.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found!" });
    }

    const user = await Users.findByPk(userId);

    if (user.role === "designer" && user.status !== "active") {
      return res.status(400).json({
        error: "Your account is not active. You cannot create products.",
      });
    }

    await product.update(productData);
    return res
      .status(200)
      .json({ product, message: "Product updated successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res, next) => {
  const productId = req.query.productId;
  const userId = req.user.id;

  try {
    const product = await productsDb.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found!" });
    }
    const user = await Users.findByPk(userId);

    if (user.role === "designer" && user.status !== "active") {
      return res.status(400).json({
        error: "Your account is not active. You cannot create products.",
      });
    }

    await productsDb.destroy({ where: { id: productId } });

    res.status(200).send({
      message: "Product was deleted successfully!",
    });
  } catch (error) {
    res.status(error.status || 500).send({
      message: error.message || "An error occurred while deleting the product.",
    });
  }
};

exports.getProductsByBrand = async (req, res) => {
  const brandId = req.query.brandId;
  const status = req.query.status || null;

  if (!brandId) {
    return res.status(400).json({ error: "Brand ID is required!" });
  }

  const productWhere = {
    brandId: brandId,
  };

  if (status) {
    productWhere.status = status;
  }

  try {
    const products = await productsDb.findAll({
      where: productWhere,
      include: [{ model: db.Users, as: "store" }],
    });
    if (products.length === 0) {
      return res
        .status(404)
        .json({ error: "No products found for this brand!" });
    }
    return res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
