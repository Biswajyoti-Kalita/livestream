const db = require("./src/models");
db.sequelize.sync({ force: false, alter: true }).then(function () {});
