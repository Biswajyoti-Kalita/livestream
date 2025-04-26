module.exports = function (sequelize, DataTypes) {
  const meeting = sequelize.define("meeting", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.TEXT
    },    
    meeting_id: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    organization: {
      type: DataTypes.STRING
    },
  }, {
    timestamps: true
  });
  return meeting;
};
