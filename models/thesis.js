const Sequelize = require("sequelize");

const sequelize = require("../db");

const Thesis = sequelize.define("thesis", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: Sequelize.STRING,
  description: Sequelize.STRING,
  years: Sequelize.DATE,
});

module.exports = Thesis;
