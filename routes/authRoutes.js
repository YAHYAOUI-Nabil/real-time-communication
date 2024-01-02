const express = require("express");
const router = express.Router();
var passport = require("passport");

const authController = require("../controllers/authController");
const rateLimiter = require("../middlewares/rateLimiter");
const checkUserValidity = require("../middlewares/checkUserValidity");

router.post(
  "/login",
  rateLimiter,
  checkUserValidity.checkUserIsValid,
  passport.authenticate("local"),
  authController.login
);

module.exports = router;
