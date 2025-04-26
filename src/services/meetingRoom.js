// Store active users by meeting room
const db = require("./../models");
const meetingRooms = {};
const meetingUserNameMapping = {};

exports.initializeRoom = (meetingId, organization, your_name) => {
    // Initialize room if needed
    if (!meetingRooms[meetingId]) {
        meetingRooms[meetingId] = new Set();
    }
}
exports.deleteRoom = (meetingId) => {
    delete meetingRooms[meetingId];
    console.log(" deleteRoom ",meetingId,  meetingRooms);
}
exports.addUserToRoom = (meetingId, userId, organization , name) => {
    meetingRooms[meetingId].add(userId);
    console.log(" addUserToRoom",  meetingId, userId,organization, meetingRooms);
    meetingUserNameMapping[userId] = {name, organization};
    db.meeting.create({
        user_id: userId,
        organization,
        meeting_id: meetingId,
        name: name
    }).then((res) => {
        console.log(`user ${name} from ${organization} added to meeting room ${meetingId}`)
    })
}

exports.removeUserFromRoom = (meetingId, userId) => {
    meetingRooms[meetingId].delete(userId);
    console.log(" removeUserFromRoom ",meetingId, userId, meetingRooms);

    db.meeting.update({},{
        where: {
            user_id: userId,
            meetingId
        }
    }).then((res) => {
        console.log(`user ${userId} left meeting room ${meetingId}`)
    })
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

exports.getUserDetails = (userId) => {
    return meetingUserNameMapping[userId];
}