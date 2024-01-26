const express = require("express");
const chatController = require("../controllers/chatController");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

router.post("/", authenticate.verifyUser, chatController.startChat);
router.get("/", authenticate.verifyUser, chatController.fetchChats);
router.get("/:id", authenticate.verifyUser, chatController.accessChat);
router.post("/group", authenticate.verifyUser, chatController.createGroupChat);
router.put("/rename", authenticate.verifyUser, chatController.renameGroup);
router.put(
  "/groupremove",
  authenticate.verifyUser,
  chatController.removeFromGroup
);
router.put("/groupadd", authenticate.verifyUser, chatController.addToGroup);

module.exports = router;
