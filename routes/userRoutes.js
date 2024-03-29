const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const rateLimiter = require("../middlewares/rateLimiter");
const checkUserValidity = require("../middlewares/checkUserValidity");
const authenticate = require("../middlewares/authenticate");

router.post("/", rateLimiter, userController.register);
router.put(
  "/validate-user",
  rateLimiter,
  checkUserValidity.checkUserIsNotValid,
  userController.validateUser
);
router.get("/", authenticate.verifyUser, userController.getUsers);
router.put(
  "/edit-account",
  rateLimiter,
  checkUserValidity.checkUserIsValid,
  authenticate.verifyUser,
  userController.editUser
);
router.put(
  "/add-user/:id",
  rateLimiter,
  authenticate.verifyUser,
  userController.addUser
);
router.delete(
  "/delete-account",
  rateLimiter,
  checkUserValidity.checkUserIsValid,
  authenticate.verifyUser,
  userController.deleteAccount
);
router.delete(
  "/remove-friend/:id",
  rateLimiter,
  authenticate.verifyUser,
  userController.removeFriend
);

module.exports = router;
