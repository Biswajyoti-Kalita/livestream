// Store active users by meeting room
const db = require("./../models");

const meetingRooms = {};

exports.initializeRoom = (meetingId) => {

    console.log("no need for initialization");
    // Initialize room if needed
    if (!meetingRooms[meetingId]) {
        meetingRooms[meetingId] = new Set();
    }
}
exports.deleteRoom = async (meetingId) => {
    // await db.meeting.destroy({
    //     where: {
    //         meeting_id: meetingId
    //     }
    // })
    // delete meetingRooms[meetingId];
    console.log("lets not delete the room")
}
exports.addUserToRoom = async (meetingId, userId) => {
    const exist = await db.meeting.findOne({
        where : {
            meeting_id: meetingId,
            user_id: userId
        }
    })
    if(!exist)
        await db.meeting.create({
            meeting_id: meetingId,
            user_id: userId
        })
    // meetingRooms[meetingId].add(userId);
}

exports.removeUserFromRoom = async (meetingId, userId) => {
    await db.meeting.destroy({
        where: {
            meeting_id: meetingId,
            user_id: userId
        }
    })
    // meetingRooms[meetingId].delete(userId);
}

exports.getRoomSize = async  (meetingId) => {
    const items = await db.meeting.findAll({
        where: {
            meeting_id: meetingId,
        },
        attributes: ["id"]
    })
    // return meetingRooms[meetingId].size;
    console.log("get room size ? ",items ? items.length : 0 )
    return items ? items.length : 0;
}

exports.hasRoom = async (meetingId) => {

    return await db.meeting.findOne({
        where: {
            meeting_id: meetingId
        }
    })
    // return meetingRooms[meetingId];
}
