const express = require("express");
const router = express.Router();

const productController = require("../controllers/products.controllers");
const { isAuthenticated, isAdmin } = require("../middlewares/auth.middleware");

router.post("/create", isAuthenticated, productController.createProduct);
router.get("/getAllProducts", productController.getAllProducts);
router.get("/getProductsByBrand", productController.getProductsByBrand);
router.get("/getProductById", productController.getProductById);
router.put("/update", isAuthenticated, productController.updateProduct);
router.delete("/delete", isAuthenticated, productController.deleteProduct);

module.exports = router;
