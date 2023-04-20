const Sequelize = require("sequelize");

const sequelize = require("../db");

const Board = sequelize.define("board", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  role:{
    type: Sequelize.STRING
  }
});

module.exports = Board;
