const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);
const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();
var db = {};

console.log(__dirname);

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(
    __dirname,
    path.sep,
    "..",
    path.sep,
    "..",
    "database.sqlite"
  ), // Path to SQLite file
  logging: true // Disable SQL query logging (optional)
});
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    var model = require(path.join(__dirname, file))(sequelize, DataTypes);
    console.log(model);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  console.log(modelName);
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

sequelize.sync({ alter: false }).catch((err) => {
  console.log(err);
  process.exit();
});

module.exports = db;
