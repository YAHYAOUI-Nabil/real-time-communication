require("dotenv").config();

const express = require("express");
const app = express();
var passport = require("passport");
const { logger } = require("./middlewares/logEvents");
const errorHandler = require("./middlewares/errorHandler");
const credentials = require("./middlewares/credentials");
const port = parseInt(process.env.PORT) || 5000;
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const path = require("path");
const session = require("express-session");
const DBconne = require("./config/DBconn");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const chatRoutes = require("./routes/chatRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

DBconne();

app.use(logger);
app.use(credentials);
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
app.use("/message", messageRoutes);
app.use("/chat", chatRoutes);
app.use("/notification", notificationRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("./client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`server is running on ${port}...`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.SOCKET_CLIENT_ORIGIN,
    // origin: "http://localhost:3000",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData.email);
    socket.emit("connected");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
    // Perform any cleanup or additional actions when a user disconnects
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));

  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat?.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) {
        return;
      }
      socket.in(user.email).emit("message received", newMessageReceived);
    });
  });

  // socket.off("setup", () => {
  //   console.log("USER DISCONNECTED");
  //   socket.leave(userData._id);
  // });
});
