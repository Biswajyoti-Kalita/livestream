module.exports = function (sequelize, DataTypes) {
  const user = sequelize.define("user", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    role: {
      type: DataTypes.INTEGER,
      defaultValue: 1 // admin, client
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1 // inactive, active
    }
  });

  return user;
};
