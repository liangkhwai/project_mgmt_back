const Sequelize = require("sequelize");

const sequelize = require("../db");

const Free_hours = sequelize.define("free_hours", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: true,
  },

  start_time: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  end_time: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  isBooked: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
  },
});

module.exports = Free_hours;
