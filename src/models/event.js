module.exports = function (sequelize, DataTypes) {
  const event = sequelize.define("event", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4, // Generates a UUID v4
      allowNull: false, // Typically you'd want UUIDs to be non-null
      unique: true,    // Usually UUIDs should be unique
    },
    filepath: {
      type: DataTypes.TEXT
    },
    title: {
      type: DataTypes.TEXT
    },    
    agenda: {
      type: DataTypes.TEXT,
    },
    description: {
      type: DataTypes.TEXT
    },
    start_date: {
      type: DataTypes.DATEONLY
    },
    start_time: {
      type: DataTypes.TIME
    },
    timezone: {
      type: DataTypes.STRING,
      defaultValue: "Asia/Riyadh"
    },
    actual_users: {
      type: DataTypes.TEXT,
      defaultValue: "[]"
    },
    added_users: {
      type: DataTypes.TEXT,
      defaultValue: "[]"
    },    status: {
      type: DataTypes.INTEGER,
      defaultValue: 0 // Pending, In-progress, Completed
    }
  });



  event.associate = function(models) {
    event.hasMany(models.chat, {
      foreignKey: "event_id",
      as: "chats",
    });
  };

  return event;
};
