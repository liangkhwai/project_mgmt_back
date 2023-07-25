const Sequelize = require("sequelize");
const sequelize = require("../db");

const Files = sequelize.define("files", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  originalname: {
    type: Sequelize.STRING,
    allowNull: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
  },
  filename:{
    type:Sequelize.STRING,
    allowNull:true

  },
  path:{
    type: Sequelize.STRING,
    allowNull: true,
  },
});

module.exports = Files;
