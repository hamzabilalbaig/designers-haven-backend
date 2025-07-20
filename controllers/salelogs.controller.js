const db = require("../models");

const saleLogsDb = db.SaleLogs;
const userDb = db.Users;
const productsDb = db.Products;

exports.createSaleLog = async (req, res) => {
  try {
    const { productId, brandId, totalAmount } = req.body;

    if (!productId || !brandId || !totalAmount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newSaleLog = await saleLogsDb.create(req.body);

    res.status(201).json(newSaleLog);
  } catch (error) {
    console.error("Error creating sale log:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getSaleLogs = async (req, res) => {
  const brandId = req.user.id;
  if (!brandId) {
    return res.status(400).json({ error: "Brand ID is required" });
  }
  try {
    const saleLogs = await saleLogsDb.findAll({
      where: { brandId },
      include: [
        {
          model: userDb,
          as: "brand",
          attributes: ["id", "fullName"],
        },
        {
          model: productsDb,
          as: "product",
          attributes: ["id", "name", "images"],
        },
      ],
    });

    res.status(200).json(saleLogs);
  } catch (error) {
    console.error("Error fetching sale logs:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getSaleLogById = async (req, res) => {
  const saleLogId = req.query.saleLogId;
  const brandId = req.query.brandId;
  if (!saleLogId || !brandId) {
    return res
      .status(400)
      .json({ error: "Sale log ID and brand ID are required" });
  }
  try {
    const saleLog = await saleLogsDb.findByPk(saleLogId, {
      where: { brandId },
      include: [
        {
          model: userDb,
          as: "brand",
          attributes: ["id", "fullName"],
        },
        {
          model: productsDb,
          as: "product",
          attributes: ["id", "name", "images"],
        },
      ],
    });

    if (!saleLog) {
      return res.status(404).json({ error: "Sale log not found" });
    }

    res.status(200).json(saleLog);
  } catch (error) {
    console.error("Error fetching sale log:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.updateSaleLog = async (req, res) => {
  const saleLogId = req.body.saleLogId;
  const brandId = req.body.brandId;
  if (!saleLogId || !brandId) {
    return res
      .status(400)
      .json({ error: "Sale log ID and brand ID are required" });
  }
  try {
    const [updated] = await saleLogsDb.update(req.body, {
      where: { id: saleLogId, brandId },
    });

    if (updated) {
      const updatedSaleLog = await saleLogsDb.findByPk(saleLogId);
      return res.status(200).json(updatedSaleLog);
    }
    throw new Error("Sale log not found or no changes made");
  } catch (error) {
    console.error("Error updating sale log:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.deleteSaleLog = async (req, res) => {
  const saleLogId = req.query.saleLogId;
  const brandId = req.query.brandId;
  if (!saleLogId || !brandId) {
    return res
      .status(400)
      .json({ error: "Sale log ID and brand ID are required" });
  }
  try {
    const deleted = await saleLogsDb.destroy({
      where: { id: saleLogId, brandId },
    });

    if (deleted) {
      return res.status(204).send();
    }
    throw new Error("Sale log not found");
  } catch (error) {
    console.error("Error deleting sale log:", error);
    res.status(500).json({ error: "Server Error" });
  }
};
