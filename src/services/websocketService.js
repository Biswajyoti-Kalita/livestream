const http = require('http');
const express = require("express");
const app = express();

const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);


const db = require("./../models");
const { initializeRoom, addUserToRoom, getRoomSize, hasRoom, removeUserFromRoom, deleteRoom, removeUserFromAllRoom } = require("./../services/meetingRoom");

// Socket.IO namespace for chat
const chatNamespace = io.of('/chat');

const { v4: uuidv4 } = require('uuid');

// Handle chat connections
chatNamespace.on('connection', (socket) => {
  let meetingId = null;
  let userId = uuidv4();
  let username = `User_${userId.substring(0, 5)}`;
  
  // Handle joining a meeting room
  socket.on('join_room', (roomId) => {
    meetingId = roomId;
    
    // Join the room
    socket.join(meetingId);

    // Initialize room
    initializeRoom(meetingId);
    
    // Remove user from all other room
    const rooms = removeUserFromAllRoom(userId);
    if(rooms.length){
      rooms.forEach((mId) => {
        console.log("send users_update ",mId)
        chatNamespace.to(mId).emit('users_update', { count: getRoomSize(mId) });
      })
    }

    // Add user to room
    addUserToRoom(meetingId, userId);
    
    
    // Update user count
    const userCount = getRoomSize(meetingId);
    chatNamespace.to(meetingId).emit('users_update', { count: userCount });
    
  });
  
  // Handle chat messages
  socket.on('chat_message', (data) => {
    if (!meetingId) return;
    

    db.chat.create({
      message: data.message,
      meeting_id: meetingId,
      user_uid: data.isAdmin ? "Admin" : username,
      is_admin: data.isAdmin ? true : false
    }).then(res => console.log("message added ")).catch(err => console.log(err));


    // Broadcast message to all users in the room
    chatNamespace.to(meetingId).emit('chat_message', {
      username: data.isAdmin ? "Admin" : username,
      message: data.message,
      timestamp: new Date().toISOString()
    });
  });
  
  // Handle setting username
  socket.on('set_username', (data) => {
    // Sanitize and limit username length
    username = data.username.substring(0, 20);
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    if (meetingId && hasRoom(meetingId)) {

      // Remove user from room
      removeUserFromRoom(meetingId, userId);
      
      // If room is empty, clean up
      if (getRoomSize(meetingId) === 0) {
        deleteRoom(meetingId);
      } else {
        // Update user count
        const userCount = getRoomSize(meetingId);
        chatNamespace.to(meetingId).emit('users_update', { count: userCount });
        
        // // Notify others that user left
        // socket.to(meetingId).emit('chat_message', {
        //   username: 'System',
        //   message: `${username} has left the chat`,
        //   timestamp: new Date().toISOString()
        // });
      }
    }
  });
});

module.exports = {
    chatNamespace,
    server,
    app
}