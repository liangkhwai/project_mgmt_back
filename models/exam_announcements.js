const Sequelize = require("sequelize");

const sequelize = require("../db");

const Exam_announcements = sequelize.define("exam_announcements", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  start_time: {
    type: Sequelize.DATE,
  },
  end_time: {
    type: Sequelize.DATE,
  },
  categories: {
    type: Sequelize.STRING,
  },
  round: {
    type: Sequelize.STRING,
  },
  years: {
    type: Sequelize.STRING,
  },
});

module.exports = Exam_announcements;
