const User = require("../models/userModel");

exports.checkUserIsNotValid = (req, res, next) => {
  const email = req.body.username;
  User.findOne({ email })
    .then((user) => {
      if (user.isValid) {
        return res.status(404).json({ message: "user is already valid!" });
      }
      req.user = user;
      return next();
    })
    .catch((err) => {
      res.status(404).json({ error: err });
    });
};

exports.checkUserIsValid = (req, res, next) => {
  const email = req.body.username;
  User.findOne({ email })
    .then((user) => {
      if (!user.isValid) {
        return res.status(404).json({ message: "user is not valid!" });
      }
      req.user = user;
      return next();
    })
    .catch((err) => {
      res.status(404).json({ error: err });
    });
};
