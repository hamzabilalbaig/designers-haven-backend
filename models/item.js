"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Items extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Items.belongsTo(models.Stores, {
        foreignKey: "storeId",
        as: "store",
      });
      Items.hasMany(models.Orders, { foreignKey: "itemId", as: "orders" });
    }
  }
  Items.init(
    {
      name: DataTypes.STRING,
      price: DataTypes.FLOAT,
      gender: DataTypes.STRING,
      category: DataTypes.STRING,
      color: DataTypes.STRING,
      size: DataTypes.STRING,
      weight: DataTypes.FLOAT,
      storeId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Items",
    }
  );
  return Items;
};
