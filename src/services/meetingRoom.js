// Store active users by meeting room
const meetingRooms = {};

exports.initializeRoom = (meetingId) => {
    // Initialize room if needed
    if (!meetingRooms[meetingId]) {
        meetingRooms[meetingId] = new Set();
    }
}
exports.deleteRoom = (meetingId) => {
    delete meetingRooms[meetingId];
    console.log(" deleteRoom ",meetingId,  meetingRooms);
}
exports.addUserToRoom = (meetingId, userId) => {
    meetingRooms[meetingId].add(userId);
    console.log(" addUserToRoom",  meetingId, userId, meetingRooms);
}

exports.removeUserFromRoom = (meetingId, userId) => {
    meetingRooms[meetingId].delete(userId);
    console.log(" removeUserFromRoom ",meetingId, userId, meetingRooms);
}

exports.removeUserFromAllRoom = (userId) => {
    console.log("remove user from all other rooms");
    const rooms = [];
    Object.keys(meetingRooms).forEach((meetingId) => {
        if(meetingRooms[meetingId][userId]){
            meetingRooms[meetingId].delete(userId);
            rooms.push(meetingId);
        }
    })
    console.log({rooms})
    return rooms;
}

exports.getRoomSize = (meetingId) => {
    console.log(" getRoomSize", meetingId, meetingRooms);
    return meetingRooms[meetingId].size;
}

exports.hasRoom = (meetingId) => {
    console.log(" hasRoom",meetingId,  meetingRooms);
    return meetingRooms[meetingId];
}
exports.getUsers = (meetingId) => {
    console.log(" getUsers",meetingId,  meetingRooms);
    return meetingRooms[meetingId];
}
