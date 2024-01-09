const express = require("express");
const messageController = require("../controllers/messageController");
const authenticate = require("../middlewares/authenticate");
const verifyUserIsValid = require("../middlewares/checkUserValidity");

const router = express.Router();

router.post(
  "/",
  authenticate.verifyUser,
  verifyUserIsValid.checkUserIsValid,
  messageController.sendMessage
);
router.get(
  "/:chatId",
  authenticate.verifyUser,
  verifyUserIsValid.checkUserIsValid,
  messageController.getAllMessages
);

module.exports = router;
