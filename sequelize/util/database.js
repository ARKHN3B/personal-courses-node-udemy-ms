const {Sequelize} = require("sequelize");

const {
        DATABASE_NAME,
        DATABASE_USERNAME,
        DATABASE_PASSWORD,
        DATABASE_DIALECT,
        DATABASE_PORT
      } = process.env;

const sequelize = new Sequelize(DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, {
  dialect: DATABASE_DIALECT,
  host   : "localhost",
  port   : DATABASE_PORT,
});

module.exports = sequelize;
