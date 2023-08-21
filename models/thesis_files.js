const Sequelize = require("sequelize");

const sequelize = require("../db");

const Thesis_files = sequelize.define("thesis_files", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  originalname:{
    type:Sequelize.STRING,
  },
  filename:{
    type : Sequelize.STRING
  },
  path:{
    type:Sequelize.STRING
  }
});

module.exports = Thesis_files;
