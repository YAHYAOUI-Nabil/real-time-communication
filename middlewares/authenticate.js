var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
var jwt = require("jsonwebtoken");
var User = require("../models/userModel");
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.ACCESS_TOKEN_SECRET_KEY;
require("dotenv").config();

passport.use(new LocalStrategy(User.authenticate()));

passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    User.findOne({ _id: jwt_payload._id })
      .then((user) => {
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      })
      .catch((err) => {
        return done(err, false);
      });
  })
);

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());

exports.getToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: 3600 * 24 * 7,
  });
};

exports.verifyUser = passport.authenticate("jwt", { session: false });

exports.verifyAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    return next();
  } else {
    err = new Error("You are not authorized to perform this operation!");
    err.status = 403;
    return next(err);
  }
};

exports.verifySuperAdmin = (req, res, next) => {
  if (req.user.isSuperAdmin) {
    return next();
  } else {
    return res
      .status(403)
      .json({ message: "You are not authorized to perform this operation!" });
  }
};
