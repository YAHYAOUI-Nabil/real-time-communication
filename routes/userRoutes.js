const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const rateLimiter = require("../middlewares/rateLimiter");
const checkUserValidity = require("../middlewares/checkUserValidity");
const authenticate = require("../middlewares/authenticate");

router.post("/", rateLimiter, userController.register);
router.post(
  "/validate-user",
  rateLimiter,
  checkUserValidity.checkUserIsNotValid,
  userController.validateUser
);
router.delete(
  "/delete-account",
  rateLimiter,
  checkUserValidity.checkUserIsValid,
  authenticate.verifyUser,
  userController.deleteAccount
);

module.exports = router;
