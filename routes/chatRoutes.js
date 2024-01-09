const express = require("express");
const chatController = require("../controllers/chatController");
const authenticate = require("../middlewares/authenticate");
const verifyUserIsValid = require("../middlewares/checkUserValidity");

const router = express.Router();

router.post(
  "/",
  authenticate.verifyUser,
  verifyUserIsValid.checkUserIsValid,
  chatController.accessChat
);
router.get(
  "/",
  authenticate.verifyUser,
  verifyUserIsValid.checkUserIsValid,
  chatController.fetchChats
);
router.post(
  "/group",
  authenticate.verifyUser,
  verifyUserIsValid.checkUserIsValid,
  chatController.createGroupChat
);
router.put(
  "/rename",
  authenticate.verifyUser,
  verifyUserIsValid.checkUserIsValid,
  chatController.renameGroup
);
router.put(
  "/groupremove",
  authenticate.verifyUser,
  verifyUserIsValid.checkUserIsValid,
  chatController.removeFromGroup
);
router.put(
  "/groupadd",
  authenticate.verifyUser,
  verifyUserIsValid.checkUserIsValid,
  chatController.addToGroup
);

module.exports = router;
