const Sequelize = require("sequelize");
const sequelize = require("../db");

const Teacher = sequelize.define("teacher", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  prefix: {
    type: Sequelize.STRING,
  },
  firstname: {
    type: Sequelize.STRING,
  },
  lastname: {
    type: Sequelize.STRING,
  },
  tel: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
  },
  pwd: {
    type: Sequelize.STRING,
  },
  line_id: {
    type: Sequelize.STRING,
  },
  isAdmin :{
    type:Sequelize.BOOLEAN,
    defaultValue:false
  },
  color_calendar:{
    type:Sequelize.STRING,
    
  }
});

module.exports = Teacher;
