const express = require("express");
const messageController = require("../controllers/messageController");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

router.post("/", authenticate.verifyUser, messageController.sendMessage);
router.get(
  "/:chatId",
  authenticate.verifyUser,
  messageController.getAllMessages
);

module.exports = router;
