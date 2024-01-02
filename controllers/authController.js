const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

exports.login = asyncHandler(async (req, res, next) => {
  const cookies = req.cookies;
  console.log(`cookie available at login: ${JSON.stringify(cookies)}`);

  // create JWTs
  const accessToken = jwt.sign(
    {
      userInfo: {
        username: req.user.email,
        id: req.user._id,
      },
    },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    { expiresIn: "10sec" }
  );
  const newRefreshToken = jwt.sign(
    {
      username: req.user.email,
      id: req.user._id,
    },
    process.env.REFRESH_TOKEN_SECRET_KEY,
    { expiresIn: "15sec" }
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

    // Saving refreshToken with current user
    req.user.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    const result = await req.user.save();
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
      fullname: req.user.fullname,
    });
  }
});
