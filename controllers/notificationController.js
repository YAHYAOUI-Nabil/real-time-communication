const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const Notification = require("../models/notificationModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

exports.getAllNotifications = asyncHandler(async (req, res) => {
  try {
    var notifications = await Notification.find({ receiver: req.user._id })
      .populate("sender", "fullname")
      .populate("chat", "_id")
      .populate("latestMessage", "content");
    res.json(notifications);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

exports.sendNotification = asyncHandler(async (req, res) => {
  const { latestMessage, chatId, userId } = req.body;

  if (!latestMessage || !chatId || !userId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newNotification = {
    sender: userId,
    receiver: req.user._id,
    latestMessage: latestMessage,
    chat: chatId,
  };

  try {
    var notification = await Notification.create(newNotification);

    notification = await notification.populate("sender", "fullname");
    notification = await notification.populate("chat");
    notification = await notification.populate("latestMessage", "content");

    res.json(notification);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

exports.deleteNotification = asyncHandler(async (req, res) => {
  const notificationId = req.params.notificationId;

  if (!notificationId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  try {
    var notification = await Notification.findByIdAndDelete(notificationId);

    res.json({
      message: `Notification with id: ${notification._id} is deleted`,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
