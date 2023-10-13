const Sequelize = require("sequelize");

const sequelize = require("../db");

const Exam_requests = sequelize.define("exam_requests", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  status: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  isApprove: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
  },
  categories: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  rate_url: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

module.exports = Exam_requests;
