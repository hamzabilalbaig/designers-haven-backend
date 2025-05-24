const itemsService = require("../services/items.services");
exports.createItem = async (req, res, next) => {
  try {
    const { itemData } = req.body;
    const { item, message } = await itemsService.createItem(itemData);

    res.status(201).send({
      message,
      item,
    });
  } catch (error) {
    res.status(error.status || 500).send({
      message: error.message || "An error occurred while creating the item.",
    });
  }
};
exports.getAllItems = async (req, res, next) => {
  try {
    const items = await itemsService.getAllItems();

    res.status(200).send(items);
  } catch (error) {
    res.status(error.status || 500).send({
      message: error.message || "An error occurred while retrieving items.",
    });
  }
};
exports.getItemById = async (req, res, next) => {
  try {
    const itemId = req.params.id;

    const item = await itemsService.getItemById(itemId);

    res.status(200).send(item);
  } catch (error) {
    res.status(error.status || 500).send({
      message: error.message || "An error occurred while retrieving the item.",
    });
  }
};
exports.updateItem = async (req, res, next) => {
  try {
    const itemId = req.params.id;
    const { itemData } = req.body;

    const { item, message } = await itemsService.updateItem(itemId, itemData);

    res.status(200).send({
      message,
      item,
    });
  } catch (error) {
    res.status(error.status || 500).send({
      message: error.message || "An error occurred while updating the item.",
    });
  }
};
exports.deleteItem = async (req, res, next) => {
  try {
    const itemId = req.params.id;

    await itemsService.deleteItem(itemId);

    res.status(200).send({
      message: "Item deleted successfully!",
    });
  } catch (error) {
    res.status(error.status || 500).send({
      message: error.message || "An error occurred while deleting the item.",
    });
  }
};
exports.getItemByName = async (req, res, next) => {
  try {
    const itemName = req.params.name;

    const item = await itemsService.getItemByName(itemName);

    res.status(200).send(item);
  } catch (error) {
    res.status(error.status || 500).send({
      message:
        error.message || "An error occurred while retrieving the item by name.",
    });
  }
};
exports.getItemsByCategory = async (req, res, next) => {
  try {
    const category = req.params.category;

    const items = await itemsService.getItemsByCategory(category);

    res.status(200).send(items);
  } catch (error) {
    res.status(error.status || 500).send({
      message:
        error.message ||
        "An error occurred while retrieving items by category.",
    });
  }
};
exports.getItemsByPriceRange = async (req, res, next) => {
  try {
    const { minPrice, maxPrice } = req.query;

    const items = await itemsService.getItemsByPriceRange(minPrice, maxPrice);

    res.status(200).send(items);
  } catch (error) {
    res.status(error.status || 500).send({
      message:
        error.message ||
        "An error occurred while retrieving items by price range.",
    });
  }
};
exports.filterItems = async (req, res, next) => {
  try {
    const filterCriteria = req.body;

    const items = await itemsService.filterItems(filterCriteria);

    res.status(200).send(items);
  } catch (error) {
    res.status(error.status || 500).send({
      message: error.message || "An error occurred while filtering items.",
    });
  }
};

exports.sortItems = async (req, res, next) => {
  try {
    const { sortBy, order } = req.query;

    const items = await itemsService.sortItems(sortBy, order);

    res.status(200).send(items);
  } catch (error) {
    res.status(error.status || 500).send({
      message: error.message || "An error occurred while sorting items.",
    });
  }
};

exports.paginateItems = async (req, res, next) => {
  try {
    const { page, limit } = req.query;

    const items = await itemsService.paginateItems(page, limit);

    res.status(200).send(items);
  } catch (error) {
    res.status(error.status || 500).send({
      message: error.message || "An error occurred while paginating items.",
    });
  }
};
