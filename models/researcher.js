const sequelize = require("../db");
const Sequelize = require("sequelize");

const Researcher = sequelize.define("researcher", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  firstname: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  lastname: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  grade: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  student_id: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  tel: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  pwd: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

module.exports = Researcher;
