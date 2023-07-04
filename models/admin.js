const Sequelize = require("sequelize");

const sequelize = require("../db");

const Admin = sequelize.define("admin", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  username: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
  },
  pwd: {
    type: Sequelize.STRING,
  },
});

module.exports = Admin;
