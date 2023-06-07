const Sequelize = require("sequelize");

const sequelize = require("../db");

const Free_hours = sequelize.define("free_hours", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  start_time: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  end_time: {
    type: Sequelize.DATE,
    allowNull: true,
  },
});

module.exports = Free_hours;
