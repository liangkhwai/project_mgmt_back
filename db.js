const Sequelize = require("sequelize");
const sequelize = new Sequelize("project_mgmt", "root", "123456789", {
  host: "localhost",
  dialect: "mysql",
  timezone:"+07:00",
  logging: console.log,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci', 
});
try {
  sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}


module.exports = sequelize;
