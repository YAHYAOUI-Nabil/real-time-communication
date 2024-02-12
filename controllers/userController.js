const User = require("../models/userModel");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authenticate = require("../middlewares/authenticate");
const sendConfirmationEmail = require("../middlewares/sendConfirmationEmail");
const generateActivationCode = require("../middlewares/generateActivationCode");

exports.register = asyncHandler(async (req, res, next) => {
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
        registration: "pending",
      });
    }
  });
});

exports.getUsers = asyncHandler(async (req, res, next) => {
  const keyword =
    req.query.search.length > 0
      ? {
          $or: [
            { fullname: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : { friends: { $elemMatch: { $eq: req.user._id } } };
  User.find(keyword)
    .then((users) => {
      if (users) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(users);
      } else {
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        res.json({ message: "no users to display" });
      }
    })
    .catch((err) => {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.json(err);
    });
});

exports.editUser = asyncHandler(async (req, res, next) => {
  const updatedUser = {
    fullname: req.body.fullname,
  };
  User.findByIdAndUpdate(req.user._id, updatedUser, { new: true })
    .then((user) => {
      if (user) {
        res.statusCode = 201;
        res.setHeader("Content-Type", "application/json");
        res.json({
          success: true,
          fullname: user.identifier,
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
});

exports.addUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const friendsList = req.user?.friends;
  if (friendsList.includes(id)) {
    res.statusCode = 201;
    res.setHeader("Content-Type", "application/json");
    res.json({ message: " you are already friends" });
  }
  try {
    const update1 = {
      friends: [...friendsList, id],
    };
    const updateFirstUser = await User.findByIdAndUpdate(
      req.user._id,
      update1,
      {
        new: true,
      }
    ).exec();

    const secondUser = await User.findById(id).exec();
    const friendsListSecondUser = secondUser?.friends;
    const update2 = {
      friends: [...friendsListSecondUser, req.user._id],
    };
    const updateSecondUser = await User.findByIdAndUpdate(id, update2, {
      new: true,
    }).exec();

    res.json({ status: "User added successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

exports.validateUser = asyncHandler(async (req, res, next) => {
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
            email: user.email,
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
});

exports.deleteAccount = asyncHandler(async (req, res, next) => {
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
});

exports.removeFriend = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  try {
    const user1 = await User.findById(req.user._id);
    const user2 = await User.findById(id);
    const friendListUser1 =
      user1?.friends && user1.friends.filter((friendId) => friendId != id);
    const friendListUser2 =
      user2?.friends &&
      user2.friends.filter((friendId) => friendId != req.user._id.toString());
    const update1 = {
      friends: friendListUser1,
    };
    const update2 = {
      friends: friendListUser2,
    };
    const updateUser1 = await User.findByIdAndUpdate(req.user._id, update1, {
      new: true,
    }).exec();
    const updateUser2 = await User.findByIdAndUpdate(id, update2, {
      new: true,
    }).exec();
    res.json({ message: "User removed successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});
