const express = require("express");
const router = express.Router();

const saleLogsController = require("../controllers/salelogs.controller");

const {
  isAuthenticated,
  isActiveDesigner,
} = require("../middlewares/auth.middleware");

router.post(
  "/create",
  isAuthenticated,
  isActiveDesigner,
  saleLogsController.createSaleLog
);
router.get("/getAll", isAuthenticated, saleLogsController.getSaleLogs);
router.get("/getById", isAuthenticated, saleLogsController.getSaleLogById);
router.put(
  "/update",
  isAuthenticated,
  isActiveDesigner,
  saleLogsController.updateSaleLog
);
router.delete(
  "/delete",
  isAuthenticated,
  isActiveDesigner,
  saleLogsController.deleteSaleLog
);

module.exports = router;
