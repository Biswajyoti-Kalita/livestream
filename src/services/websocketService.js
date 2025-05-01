const http = require('http');
const express = require("express");
const app = express();

const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);


const db = require("./../models");
const { initializeRoom, addUserToRoom, getRoomSize, hasRoom, removeUserFromRoom, deleteRoom, removeUserFromAllRoom, getUserDetails } = require("./../services/meetingRoom");

// Socket.IO namespace for chat
const chatNamespace = io.of('/chat');

const { v4: uuidv4 } = require('uuid');

// Handle chat connections
chatNamespace.on('connection', (socket) => {
  let meetingId = null;
  let userId = uuidv4();
  let username = `User_${userId.substring(0, 5)}`;
  
  // Handle joining a meeting room
  socket.on('join_room', (data) => {
    meetingId = data.meetingId;
    
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
    addUserToRoom(meetingId, userId, data.organization, data.name);
    
    
    // Update user count
    const userCount = getRoomSize(meetingId);
    chatNamespace.to(meetingId).emit('users_update', { count: userCount });
    
  });
  

  socket.on("remove_message" , (messageId) => {

    console.log("remove_message ", messageId, meetingId)
    if (!meetingId) return;

    // Broadcast message to all users in the room
    chatNamespace.to(meetingId).emit('delete_message', messageId);
    
    db.chat.destroy({
      where: {
        id: messageId,
        meeting_id: meetingId,
      }
    }).then((res) => {
      console.log(res);
    })

  })

  socket.on("refresh_message" , () => {
    console.log(" refresh_message ");
    if (!meetingId) return;

    // Broadcast message to all users in the room
    chatNamespace.to(meetingId).emit('refresh_message');

  })


  // Handle chat messages
  socket.on('chat_message',async (data) => {
    if (!meetingId) return;
    
    const userDetails = getUserDetails(userId);

    const newChat = await db.chat.create({
      message: data.message,
      meeting_id: meetingId,
      user_uid: data.isAdmin ? "Admin" : username,
      name: data.isAdmin ? "NextBroadcastMedia" :  (userDetails && userDetails['name']) ? userDetails['name']: username,
      organization: data.isAdmin ? "NextBroadcastMedia" :  (userDetails && userDetails['organization']) ? userDetails['organization']: '',
      is_admin: data.isAdmin ? true : false,
      user_id: userId,
    }).catch(err => console.log(err));



    // Broadcast message to all users in the room
    chatNamespace.to(meetingId).emit('chat_message', {
      username: data.isAdmin ? "NextBroadcastMedia" :  (userDetails && userDetails['name']) ? userDetails['name']: username,
      organization: data.isAdmin ? "NextBroadcastMedia" :  (userDetails && userDetails['organization']) ? userDetails['organization']: '',
      message: data.message,
      timestamp: new Date().toISOString(),
      id: newChat ? newChat['id'] : ''
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