require("dotenv").config();

const express = require("express");
const app = express();
var passport = require("passport");

const port = parseInt(process.env.PORT) || 5000;
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const path = require("path");
const session = require("express-session");
const DBconne = require("./config/DBconn");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

DBconne();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: process.env.ACCESS_TOKEN_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/user", userRoutes);
app.use("/auth", authRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("./frontend/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
