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
  },
  categories: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.STRING,
  },
  start_time: {
    type: Sequelize.DATE,
  },
  end_time: {
    type: Sequelize.DATE,
  },
  feedback: {
    type: Sequelize.STRING,
  },
});

module.exports = Exam_requests;
