const express = require("express");
const router = express.Router();

const userController = require("../controllers/users.controllers");

const { isAuthenticated, isAdmin } = require("../middlewares/auth.middleware");

router.post("/register", userController.createUser);
router.post("/login", userController.login);
router.get("/getAllUsers", userController.getAllUsers);
router.get("/getUserById", isAuthenticated, userController.getUserById);
router.put("/updateUser", isAuthenticated, userController.updateUser);
router.delete("/deleteUser", isAuthenticated, userController.deleteUser);

module.exports = router;
