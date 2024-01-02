const User = require("../models/userModel");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const authenticate = require("../middlewares/authenticate");
const sendConfirmationEmail = require("../middlewares/sendConfirmationEmail");
const generateActivationCode = require("../middlewares/generateActivationCode");

exports.register = (req, res, next) => {
  const activationCode = generateActivationCode();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(req.body.username)) {
    return res.status(404).json({ message: "addresse email non valide." });
  }

  const newUser = new User({
    fullname: req.body.fullname,
    email: req.body.username,
    authCode: activationCode,
  });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.json({ err: err });
    } else {
      sendConfirmationEmail({ email: user.email, authCode: activationCode });
      res.statusCode = 201;
      res.setHeader("Content-Type", "application/json");
      res.json({
        isValid: user.isValid,
        registration: "pending",
        status:
          "You are Successfully registered and still waiting to validate your account!",
      });
    }
  });
};

exports.signin = (req, res, next) => {
  var token = authenticate.getToken({ _id: req.user._id.valueOf() });
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({
    success: true,
    token: token,
    identifier: req.user.identifier,
    email: req.user.email,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    phone: req.user.phone,
    status: "You are successfully logged in!",
  });
};

exports.editUser = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const updatedUser = {
    identifier: req.body.identifier,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    isFan: req.body.isFan,
    isAdmin: req.body.isAdmin,
    isSuperAdmin: req.body.isSuperAdmin,
  };
  User.findByIdAndUpdate(req.user._id, updatedUser, { new: true })
    .then((user) => {
      if (user) {
        res.statusCode = 201;
        res.setHeader("Content-Type", "application/json");
        res.json({
          success: true,
          token: token,
          identifier: user.identifier,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          status: "User infos successfully updated",
        });
      } else {
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        res.json({ message: "user not found" });
      }
    })
    .catch((err) => {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.json(err);
    });
};

exports.validateUser = async (req, res, next) => {
  const cookies = req.cookies;

  if (req.body.authCode != req.user.authCode) {
    return res.status(404).json({ error: "validation code not correct!" });
  }
  const updatedUser = {
    isValid: true,
  };
  User.findByIdAndUpdate(req.user._id, updatedUser, { new: true })
    .then((user) => {
      if (user) {
        passport.authenticate("local")(req, res, async () => {
          const accessToken = jwt.sign(
            {
              userInfo: {
                username: user.email,
                id: user._id,
              },
            },
            process.env.ACCESS_TOKEN_SECRET_KEY,
            { expiresIn: "10sec" }
          );
          const newRefreshToken = jwt.sign(
            {
              username: user.email,
              id: user._id,
            },
            process.env.REFRESH_TOKEN_SECRET_KEY,
            { expiresIn: "15sec" }
          );

          // Changed to let keyword
          let newRefreshTokenArray = !cookies?.jwt
            ? user.refreshToken
            : user.refreshToken.filter((rt) => rt !== cookies.jwt);

          if (cookies?.jwt) {
            /* 
            Scenario added here: 
                1) User logs in but never uses RT and does not logout 
                2) RT is stolen
                3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
            */
            const refreshToken = cookies.jwt;
            const foundToken = await User.findOne({ refreshToken }).exec();

            // Detected refresh token reuse!
            if (!foundToken) {
              console.log("attempted refresh token reuse at login!");
              // clear out ALL previous refresh tokens
              newRefreshTokenArray = [];
            }

            res.clearCookie("jwt", {
              httpOnly: true,
              sameSite: "None",
              secure: true,
            });
          }

          // Saving refreshToken with current user
          user.refreshToken = [...newRefreshTokenArray, newRefreshToken];
          const result = await user.save();
          console.log(result);

          // Creates Secure Cookie with refresh token
          res.cookie("jwt", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 24 * 60 * 60 * 1000,
          });

          // Send authorization roles and access token to user
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({
            accessToken,
            fullname: user.fullname,
          });
        });
      } else {
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        res.json({ message: "user not found" });
      }
    })
    .catch((err) => {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.json(err);
    });
};

exports.deleteAccount = (req, res, next) => {
  User.findOneAndRemove({ email: req.user.email })
    .then((user) => {
      if (user) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ message: "Account deleted successfully" });
      } else {
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        res.json({ message: "user not found" });
      }
    })
    .catch((err) => {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.json(err);
    });
};
