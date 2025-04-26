const express = require("express");
const {
  protect,
  sessionMiddileware
} = require("../middlewares/authMiddleware");
const { dashboardView } = require("../controllers/admin/indexController");
const authController = require("../controllers/admin/authController");
const chatController = require("../controllers/admin/ChatController");
const eventController = require("../controllers/admin/EventController");
const meetingController = require("../controllers/admin/MeetingController");

const uploadController = require("../controllers/admin/uploadController");
const { upload } = require("../services/uploadService");


const router = express.Router();

// router.post("/register", register);
router.post("/login", authController.login);
router.get("/login", authController.loginView);

router.get("/dashboard", sessionMiddileware, dashboardView);
router.get("/", authController.loginView );


// APP
router.get("/chats", sessionMiddileware, chatController.chatView);
router.get("/api/chats", sessionMiddileware, chatController.getChats);
router.get("/api/chat", sessionMiddileware, chatController.getChat);
router.delete("/api/chat", sessionMiddileware, chatController.deleteChat);
router.post("/api/chat", sessionMiddileware, chatController.addChat);
router.put("/api/chat", sessionMiddileware, chatController.putChat);


// EVENT
router.get("/events", sessionMiddileware, eventController.eventView);
router.get("/api/events", sessionMiddileware, eventController.getEvents);
router.get("/api/event", sessionMiddileware, eventController.getEvent);
router.delete("/api/event", sessionMiddileware, eventController.deleteEvent);
router.post("/api/event", sessionMiddileware, eventController.addEvent);
router.put("/api/event", sessionMiddileware, eventController.putEvent);
router.post("/api/startevent", sessionMiddileware, eventController.startEvent);


// MEETING
router.get("/meetings", sessionMiddileware, meetingController.meetingView);
router.get("/api/meetings", sessionMiddileware, meetingController.getMeetings);
router.get("/api/meeting", sessionMiddileware, meetingController.getMeeting);
router.delete("/api/meeting", sessionMiddileware, meetingController.deleteMeeting);
router.post("/api/meeting", sessionMiddileware, meetingController.addMeeting);
router.put("/api/meeting", sessionMiddileware, meetingController.putMeeting);


//CHAT
router.post("/api/adduser", sessionMiddileware, chatController.addTempUser);




router.post("/api/upload", upload.single("file"), uploadController.upload);

//LOGOUT
router.get("/logout", sessionMiddileware, authController.logout);


module.exports = router;
