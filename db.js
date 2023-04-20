const Sequelize = require("sequelize");
const sequelize = new Sequelize("project_mgmt", "root", "123456789", {
  host: "localhost",
  dialect: "mysql",
  logging: console.log,
});
try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}


module.exports = sequelize;
