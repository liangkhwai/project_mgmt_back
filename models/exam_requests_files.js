const Sequelize = require("sequelize");

const sequelize = require("../db");

const Exam_requests_files = sequelize.define("exam_requests_files", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  files_path:{
    type:Sequelize.STRING
  }
});

module.exports = Exam_requests_files;
