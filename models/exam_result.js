const Sequelize = require("sequelize");

const sequelize = require("../db");

const Exam_result = sequelize.define("exam_result", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  feedback:{
    type:Sequelize.STRING,
    allowNull:true
  },
  result:{
    type:Sequelize.BOOLEAN,
    allowNull:true
  }
  

});

module.exports = Exam_result;
