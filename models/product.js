"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    static associate(models) {
      Products.belongsTo(models.Users, {
        foreignKey: "brandId",
        as: "store",
      });
    }
  }
  Products.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      price: DataTypes.DOUBLE,
      categories: DataTypes.ARRAY(DataTypes.STRING),
      orderType: DataTypes.STRING,
      note: DataTypes.TEXT,
      images: DataTypes.ARRAY(DataTypes.STRING),
      brandId: DataTypes.INTEGER,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Products",
      paranoid: true,
    }
  );
  return Products;
};
