"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      Users.hasMany(models.Products, {
        foreignKey: "brandId",
        as: "products",
      });
    }
  }
  Users.init(
    {
      fullName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      phone: DataTypes.STRING,
      avatar: DataTypes.STRING,
      city: DataTypes.STRING,
      country: DataTypes.STRING,
      gender: DataTypes.STRING,
      birthdate: DataTypes.DATE,
      bio: DataTypes.TEXT,
      whatsApp: DataTypes.STRING,
      insta: DataTypes.STRING,
      role: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Users",
      paranoid: true,
    }
  );
  return Users;
};
