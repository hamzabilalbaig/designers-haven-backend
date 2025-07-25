const express = require("express");
const router = express.Router();

const productController = require("../controllers/products.controllers");
const {
  isAuthenticated,
  isActiveDesigner,
} = require("../middlewares/auth.middleware");

router.post(
  "/create",
  isAuthenticated,
  isActiveDesigner,
  productController.createProduct
);
router.get("/getAllProducts", productController.getAllProducts);
router.get("/getProductsByBrand", productController.getProductsByBrand);
router.get("/getProductById", productController.getProductById);
router.put(
  "/update",
  isAuthenticated,
  isActiveDesigner,
  productController.updateProduct
);
router.delete(
  "/delete",
  isAuthenticated,
  isActiveDesigner,
  productController.deleteProduct
);

module.exports = router;
