const Sequelize = require("sequelize");

const sequelize = require("../db");

const Group = sequelize.define("group", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  status: {
    type: Sequelize.STRING,
    // allowNull: true,
    defaultValue: "ยังไม่ยื่นสอบหัวข้อ"
  },
});

module.exports = Group;
