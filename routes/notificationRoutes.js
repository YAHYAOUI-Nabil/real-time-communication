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
  "/",
  authenticate.verifyUser,
  notificationController.getAllNotifications
);
router.delete(
  "/:notificationId",
  authenticate.verifyUser,
  notificationController.deleteNotification
);

module.exports = router;
