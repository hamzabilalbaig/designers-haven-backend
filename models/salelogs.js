"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SaleLogs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SaleLogs.belongsTo(models.Products, {
        foreignKey: "productId",
        as: "product",
      });
      SaleLogs.belongsTo(models.Users, {
        foreignKey: "brandId",
        as: "brand",
      });
    }
  }
  SaleLogs.init(
    {
      productId: DataTypes.INTEGER,
      brandId: DataTypes.INTEGER,
      customerName: DataTypes.STRING,
      totalAmount: DataTypes.DOUBLE,
      date: DataTypes.DATEONLY,
      orderStatus: DataTypes.STRING,
      orderType: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "SaleLogs",
      paranoid: true,
    }
  );
  return SaleLogs;
};
