module.exports = function (sequelize, DataTypes) {
  const chat = sequelize.define("chat", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    message: {
      type: DataTypes.TEXT
    },    
    user_uid: {
      type: DataTypes.STRING
    },
    meeting_id: {
      type: DataTypes.STRING
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0 // No, Yes
    },
  });

  chat.associate = function(models) {
    chat.belongsTo(models.event, {
      foreignKey: "event_id",
      as: "event",
    });
  };

  return chat;
};
