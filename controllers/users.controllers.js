const userService = require("../services/users.services");

exports.createUser = async (req, res, next) => {
  try {
    const { userData } = req.body;
    const { user, token } = await userService.createUser(userData);

    res.status(200).send({
      message: "User was registered successfully!",
      user,
      accessToken: token,
    });
  } catch (error) {
    res.status(error.status || 500).send({
      message: error.message || "An error occurred while creating the user.",
    });
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

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();

    res.status(200).send(users);
  } catch (error) {
    res.status(error.status || 500).send({
      message: error.message || "An error occurred while retrieving users.",
    });
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await userService.getUserById(userId);

    res.status(200).send(user);
  } catch (error) {
    res.status(error.status || 500).send({
      message: error.message || "An error occurred while retrieving the user.",
    });
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { userData } = req.body;

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
    const userId = req.params.id;

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
