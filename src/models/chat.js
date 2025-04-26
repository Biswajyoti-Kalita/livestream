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
    name: {
      type: DataTypes.STRING
    },
    organization: {
      type: DataTypes.STRING
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
  },{
    timestamps: true
  });

  chat.associate = function(models) {
    chat.belongsTo(models.event, {
      foreignKey: "event_id",
      as: "event",
    });
  };

  return chat;
};
