const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

exports.login = asyncHandler(async (req, res, next) => {
  const cookies = req.cookies;

  // create JWTs
  const accessToken = jwt.sign(
    {
      userInfo: {
        username: req.user.email,
        id: req.user._id,
      },
    },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    { expiresIn: "5d" }
  );
  const newRefreshToken = jwt.sign(
    {
      username: req.user.email,
      id: req.user._id,
    },
    process.env.REFRESH_TOKEN_SECRET_KEY,
    { expiresIn: "10sec" }
  );

  // Changed to let keyword
  let newRefreshTokenArray = !cookies?.jwt
    ? req.user.refreshToken
    : req.user.refreshToken.filter((rt) => rt !== cookies.jwt);
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

    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  }
  // Saving refreshToken with current user
  req.user.refreshToken = [...newRefreshTokenArray, newRefreshToken];
  const result = await req.user.save();

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
    fullname: req.user.fullname,
  });
});

exports.refresh = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

  const foundUser = await User.findOne({ refreshToken }).exec();

  // Detected refresh token reuse!
  if (!foundUser) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY,
      async (err, decoded) => {
        if (err) return res.sendStatus(403); //Forbidden
        console.log("attempted refresh token reuse!");
        const hackedUser = await User.findOne({
          email: decoded.username,
        }).exec();
        hackedUser.refreshToken = [];
        const result = await hackedUser.save();
        console.log(result);
      }
    );
    return res.sendStatus(403); //Forbidden
  }

  const newRefreshTokenArray = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken
  );
  // evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET_KEY,
    async (err, decoded) => {
      if (err) {
        console.log("expired refresh token");
        foundUser.refreshToken = [...newRefreshTokenArray];
        const result = await foundUser.save();
        console.log(result);
        return res.sendStatus(403);
      }
      if (err || foundUser.email !== decoded.username) {
        return res.sendStatus(403);
      }

      // Refresh token was still valid
      const accessToken = jwt.sign(
        {
          userInfo: {
            username: decoded.username,
            id: decoded.id,
          },
        },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        { expiresIn: "5sec" }
      );

      const newRefreshToken = jwt.sign(
        {
          username: foundUser.username,
          id: foundUser._id,
        },
        process.env.REFRESH_TOKEN_SECRET_KEY,
        { expiresIn: "10sec" }
      );
      // Saving refreshToken with current user
      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      const result = await foundUser.save();

      // Creates Secure Cookie with refresh token
      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json({ accessToken });
    }
  );
});

exports.logout = asyncHandler(async (req, res) => {
  // On client, also delete the accessToken
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    res.sendStatus(204);
  }
  // Delete refreshToken in db
  foundUser.refreshToken = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken
  );

  const result = await foundUser.save();

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "user logged out successfully" });
});
