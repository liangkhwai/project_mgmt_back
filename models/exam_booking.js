const Sequelize = require("sequelize");

const sequelize = require("../db");

const Exam_booking = sequelize.define("exam_booking", {
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
  location: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  isResult: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
  },
});

module.exports = Exam_booking;
