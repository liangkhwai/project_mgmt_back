const Sequelize = require("sequelize");

const sequelize = require("../db");

const Exam_requests_files = sequelize.define("exam_requests_files", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  originalname: {
    type: Sequelize.STRING,
    allowNull: true,
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

module.exports = Exam_requests_files;
