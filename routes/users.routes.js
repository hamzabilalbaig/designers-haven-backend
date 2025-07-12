const express = require("express");
const router = express.Router();

const userController = require("../controllers/users.controllers");

const { isAuthenticated, isAdmin } = require("../middlewares/auth.middleware");

router.post("/create", userController.createUser);
router.post("/login", userController.login);
router.get("/getAllDesigners", userController.getAllDesigners);
router.get("/getUserById", isAuthenticated, userController.getUserById);
router.put("/update", isAuthenticated, userController.updateUser);
router.delete("/delete", isAuthenticated, isAdmin, userController.deleteUser);
router.put("/updatePassword", isAuthenticated, userController.updatePassword);

router.get(
  "/admin/metrics",
  isAuthenticated,
  isAdmin,
  userController.getDashboardMetrics
);
router.get(
  "/designer/metrics",
  isAuthenticated,
  userController.getDesignerMetrics
);

module.exports = router;
