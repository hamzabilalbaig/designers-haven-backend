const express = require("express");
const router = express.Router();

const userController = require("../controllers/users.controllers");

router.post("/register", userController.createUser);
router.post("/login", userController.login);
router.get("/getAllUsers", userController.getAllUsers);
router.get("/getUserById/:id", userController.getUserById);
router.put("/updateUser/:id", userController.updateUser);
router.delete("/deleteUser/:id", userController.deleteUser);
router.get("/getUserByEmail/:email", userController.getUserByEmail);

module.exports = router;
