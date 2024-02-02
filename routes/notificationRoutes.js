const express = require("express");
const notificationController = require("../controllers/notificationController");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

router.post(
  "/",
  authenticate.verifyUser,
  notificationController.sendNotification
);
router.get(
  "/:userId",
  authenticate.verifyUser,
  notificationController.getAllNotifications
);

module.exports = router;
