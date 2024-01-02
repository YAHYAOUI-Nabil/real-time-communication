const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const rateLimiter = require("../middlewares/rateLimiter");
const checkUserValidity = require("../middlewares/checkUserValidity");

router.post("/", rateLimiter, userController.register);
router.post(
  "/validate-user",
  rateLimiter,
  checkUserValidity.checkUserIsNotValid,
  userController.validateUser
);

module.exports = router;
