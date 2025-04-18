const express = require("express");
const {
  protect,
  sessionMiddileware
} = require("../middlewares/authMiddleware");

const router = express.Router();
const eventsController = require("../controllers/client/eventController");
const chatController = require("../controllers/client/chatController");

// QUOTES
// router.get("/check_license", protect, checkLicense);
// router.get("/check_license", checkLicense);

// router.get("/latest", binaries.latestBinaries);
router.get("/event/public", eventsController.getPublicPath);
router.get("/event/:id", eventsController.getEventById);

router.get("/meeting", eventsController.meetingView);


router.post("/api/send-message", chatController.sendMessage);

router.get("/api/active-users/:meetingId", chatController.getActiveUsers);

router.get("/api/messages/:meetingId", chatController.getMessages);



module.exports = router;
