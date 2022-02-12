const {Sequelize, DataTypes} = require("sequelize");

const sequelize = require("../util/database");

const Product = sequelize.define(
  "product",
  // Attributes are equals to the fields of our table
  // cf. https://sequelize.org/master/manual/model-basics.html
  {
    id   : {
      type         : DataTypes.INTEGER,
      autoIncrement: true,
      allowNull    : false,
      primaryKey   : true,
    },
    title: {
      type     : DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    description: DataTypes.TEXT,
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }
);

module.exports = Product;
