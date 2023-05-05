const Sequelize = require("sequelize");

const sequelize = require("../db");

const Categorie_room = sequelize.define("categorie_room", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  room:{
    type: Sequelize.STRING
  },
  type:{
    type: Sequelize.STRING
  },
  year:{
    type: Sequelize.STRING
  },
});

module.exports = Categorie_room;
