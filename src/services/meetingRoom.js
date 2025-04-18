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
}
exports.addUserToRoom = (meetingId, userId) => {
    meetingRooms[meetingId].add(userId);
}

exports.removeUserToRoom = (meetingId, userId) => {
    meetingRooms[meetingId].delete(userId);
}

exports.getRoomSize = (meetingId) => {
    return meetingRooms[meetingId].size;
}

exports.hasRoom = (meetingId) => {
    return meetingRooms[meetingId];
}
