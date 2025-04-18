
const db = require("../../models");
const { chatNamespace } = require("../../services/websocketService");

const { initializeRoom, addUserToRoom, getRoomSize, hasRoom, removeUserToRoom, deleteRoom } = require("./../../services/meetingRoom");

// API endpoint to send messages (alternative to socket)
exports.sendMessage = async (req,res) => {
    const { meetingId, message, username } = req.body;
      
      if (!meetingId || !message) {
        return res.status(400).json({ error: 'Meeting ID and message are required' });
      }
      
      if (!hasRoom(meetingId)) {
        return res.status(404).json({ error: 'Meeting room not found' });
      }
      
      // Use provided username or default
      const senderName = username || 'Anonymous User';
      
      await db.chat.create({
        message,
        meeting_id: meetingId,
        user_uid: senderName
      })
      // Broadcast message to all clients in the room
      chatNamespace.to(meetingId).emit('chat_message', {
        username: senderName,
        message: message,
        timestamp: new Date().toISOString()
      });
      
      res.status(200).json({ success: true });
}


exports.getActiveUsers = async (req,res) => {
  const { meetingId } = req.params;

  if (!hasRoom(meetingId)) {
    return res.status(200).json({ count: 0 });
  }

  res.status(200).json({ count: getRoomSize(meetingId)});
}

exports.getMessages = async (req,res) => {
  const { meetingId } = req.params;

  const messages = await db.chat.findAll({
    event_id: meetingId
  })
  
  res.status(200).send({messages});
}