const db = require("../models");

const itemDb = db.Items;
const { Op } = require("sequelize");

exports.createItem = async (itemData) => {
  if (!itemData.name || !itemData.price) {
    const error = new Error("Content cannot be empty!");
    error.status = 400;
    throw error;
  }

  const item = await itemDb.create(itemData);
  return { item, message: "Item created successfully!" };
};

exports.getAllItems = async () => {
  const items = await itemDb.findAll();
  return items;
};

exports.getItemById = async (itemId) => {
  if (!itemId) {
    const error = new Error("Item ID cannot be empty!");
    error.status = 400;
    throw error;
  }

  const item = await itemDb.findByPk(itemId);
  if (!item) {
    const error = new Error("Item not found.");
    error.status = 404;
    throw error;
  }

  return item;
};

exports.updateItem = async (itemId, itemData) => {
  if (!itemId || !itemData) {
    const error = new Error("Item ID and data cannot be empty!");
    error.status = 400;
    throw error;
  }

  const item = await itemDb.findByPk(itemId);
  if (!item) {
    const error = new Error("Item not found.");
    error.status = 404;
    throw error;
  }

  await item.update(itemData);
  return { item, message: "Item updated successfully!" };
};

exports.deleteItem = async (itemId) => {
  if (!itemId) {
    const error = new Error("Item ID cannot be empty!");
    error.status = 400;
    throw error;
  }

  const item = await itemDb.findByPk(itemId);
  if (!item) {
    const error = new Error("Item not found.");
    error.status = 404;
    throw error;
  }

  await item.destroy();
  return { message: "Item deleted successfully!" };
};

exports.filterItems = async (filterCriteria) => {
  if (!filterCriteria || Object.keys(filterCriteria).length === 0) {
    const error = new Error("Filter criteria cannot be empty!");
    error.status = 400;
    throw error;
  }

  const items = await itemDb.findAll({
    where: {
      [Op.or]: [
        { name: { [Op.like]: `%${filterCriteria.name || ""}%` } },
        {
          price: filterCriteria.price
            ? filterCriteria.price
            : { [Op.ne]: null },
        },
      ],
    },
  });

  return items;
};

exports.getItemByName = async (name) => {
  if (!name) {
    const error = new Error("Item name cannot be empty!");
    error.status = 400;
    throw error;
  }

  const item = await itemDb.findOne({ where: { name } });
  if (!item) {
    const error = new Error("Item not found.");
    error.status = 404;
    throw error;
  }

  return item;
};

exports.getItemsByPriceRange = async (minPrice, maxPrice) => {
  if (minPrice === undefined || maxPrice === undefined) {
    const error = new Error("Price range cannot be empty!");
    error.status = 400;
    throw error;
  }

  const items = await itemDb.findAll({
    where: {
      price: {
        [Op.between]: [minPrice, maxPrice],
      },
    },
  });

  return items;
};

exports.sortItems = async (sortBy, order = "ASC") => {
  if (!sortBy) {
    const error = new Error("Sort criteria cannot be empty!");
    error.status = 400;
    throw error;
  }

  const items = await itemDb.findAll({
    order: [[sortBy, order.toUpperCase()]],
  });

  return items;
};
exports.paginateItems = async (page, limit) => {
  if (page < 1 || limit < 1) {
    const error = new Error("Page and limit must be greater than 0!");
    error.status = 400;
    throw error;
  }

  const offset = (page - 1) * limit;
  const items = await itemDb.findAll({
    limit: limit,
    offset: offset,
  });

  return items;
};
exports.getItemByCategory = async (category) => {
  if (!category) {
    const error = new Error("Category cannot be empty!");
    error.status = 400;
    throw error;
  }

  const items = await itemDb.findAll({ where: { category } });
  if (items.length === 0) {
    const error = new Error("No items found in this category.");
    error.status = 404;
    throw error;
  }

  return items;
};
