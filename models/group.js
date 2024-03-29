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
    defaultValue: "ยังไม่ยื่นเสนอหัวข้อ"
  },
  isApproveTitle: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Group;
